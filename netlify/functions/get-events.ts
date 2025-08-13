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

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);
    
    const events = await sql`
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
      WHERE status = 'active'
      ORDER BY date ASC
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ events }),
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch events' }),
    };
  }
};