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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get user from Netlify Identity
  const user = context.clientContext?.user;
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Authentication required' }),
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { eventId, seatIds, totalAmount } = requestBody;

  if (!eventId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0 || !totalAmount) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Start transaction by checking seat availability
    const availableSeats = await sql`
      SELECT id, status 
      FROM seats 
      WHERE id = ANY(${seatIds}) AND status = 'available'
    `;

    if (availableSeats.length !== seatIds.length) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: 'Some seats are no longer available' }),
      };
    }

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (user_id, event_id, total_amount, status)
      VALUES (${user.sub}, ${eventId}, ${totalAmount}, 'pending')
      RETURNING id
    `;

    const orderId = orderResult[0].id;

    // Reserve seats
    await sql`
      UPDATE seats 
      SET status = 'reserved', reserved_until = NOW() + INTERVAL '10 minutes'
      WHERE id = ANY(${seatIds})
    `;

    // Create tickets
    const ticketInserts = seatIds.map(seatId => 
      sql`
        INSERT INTO tickets (order_id, event_id, seat_id, status)
        VALUES (${orderId}, ${eventId}, ${seatId}, 'reserved')
      `
    );

    await Promise.all(ticketInserts);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        orderId,
        message: 'Seats reserved successfully',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error reserving seats:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to reserve seats' }),
    };
  }
};