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

  // Check if user is admin
  const userRole = user.app_metadata?.role;
  if (!userRole || !['admin', 'super_admin', 'event_manager'].includes(userRole)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Admin access required' }),
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

  const {
    title,
    description,
    date,
    time,
    venue_name,
    venue_address,
    venue_city,
    image_url,
    category,
  } = requestBody;

  if (!title || !description || !date || !time || !venue_name || !venue_address || !venue_city || !category) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    const result = await sql`
      INSERT INTO events (
        title, description, date, time, venue_name, venue_address, 
        venue_city, image_url, category, status, created_by
      )
      VALUES (
        ${title}, ${description}, ${date}, ${time}, ${venue_name}, 
        ${venue_address}, ${venue_city}, ${image_url || null}, 
        ${category}, 'active', ${user.sub}
      )
      RETURNING *
    `;

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        event: result[0],
        message: 'Event created successfully',
      }),
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create event' }),
    };
  }
};