import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const eventId = event.queryStringParameters?.id;
  if (!eventId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Event ID is required' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);
    
    // Get event details
    const eventResult = await sql`
      SELECT 
        id,
        title,
        description,
        date,
        time,
        venue_name,
        venue_address,
        venue_city,
        image_url,
        category,
        status,
        created_at
      FROM events 
      WHERE id = ${eventId}
    `;

    if (eventResult.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    // Get venue sections and seats
    const sections = await sql`
      SELECT 
        s.id,
        s.name,
        s.type,
        s.price,
        s.color,
        s.x,
        s.y,
        s.width,
        s.height,
        COUNT(se.id) as total_seats,
        COUNT(CASE WHEN se.status = 'available' THEN 1 END) as available_seats
      FROM sections s
      LEFT JOIN seats se ON s.id = se.section_id
      WHERE s.event_id = ${eventId}
      GROUP BY s.id, s.name, s.type, s.price, s.color, s.x, s.y, s.width, s.height
      ORDER BY s.name
    `;

    // Get seats for each section
    const seats = await sql`
      SELECT 
        id,
        section_id,
        row_name,
        seat_number,
        status,
        x,
        y
      FROM seats
      WHERE section_id IN (
        SELECT id FROM sections WHERE event_id = ${eventId}
      )
      ORDER BY section_id, row_name, seat_number
    `;

    // Group seats by section
    const sectionsWithSeats = sections.map(section => ({
      ...section,
      seats: seats.filter(seat => seat.section_id === section.id).map(seat => ({
        id: seat.id,
        row: seat.row_name,
        number: seat.seat_number,
        status: seat.status,
        x: seat.x,
        y: seat.y,
      })),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        event: eventResult[0],
        sections: sectionsWithSeats,
      }),
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch event details' }),
    };
  }
};