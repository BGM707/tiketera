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

  // Get user from Authorization header
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Authentication required' }),
    };
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Decode JWT token to get user info
  let user;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = {
      sub: payload.sub,
      email: payload.email
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token format' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Check if user is admin
    const adminCheck = await sql`
      SELECT au.role, au.permissions 
      FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = ${user.sub} AND au.is_active = true
    `;

    if (adminCheck.length === 0) {
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

    // Get user ID for created_by field
    const userData = await sql`
      SELECT id FROM users WHERE netlify_id = ${user.sub}
    `;

    if (userData.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const result = await sql`
      INSERT INTO events (
        title, description, date, time, venue_name, venue_address, 
        venue_city, image_url, category, status, created_by
      )
      VALUES (
        ${title}, ${description}, ${date}, ${time}, ${venue_name}, 
        ${venue_address}, ${venue_city}, ${image_url || null}, 
        ${category}, 'active', ${userData[0].id}
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