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

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Check if user is admin
    const adminCheck = await sql`
      SELECT au.role 
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
      name,
      address,
      city,
      country = 'Chile',
      capacity,
      description,
      latitude,
      longitude,
      amenities = [],
      contact_info = {},
    } = requestBody;

    if (!name || !address || !city || !capacity) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const result = await sql`
      INSERT INTO venues (
        name, address, city, country, capacity, description,
        latitude, longitude, amenities, contact_info, status
      )
      VALUES (
        ${name}, ${address}, ${city}, ${country}, ${capacity}, ${description},
        ${latitude || null}, ${longitude || null}, 
        ${JSON.stringify(amenities)}, ${JSON.stringify(contact_info)}, 'active'
      )
      RETURNING *
    `;

    // Log security event
    const userData = await sql`SELECT id FROM users WHERE netlify_id = ${user.sub}`;
    if (userData.length > 0) {
      await sql`
        INSERT INTO security_logs (user_id, action, resource, resource_id, status, details)
        VALUES (
          ${userData[0].id}, 'create', 'venue', ${result[0].id}, 'success',
          '{"venue_name": "${name}"}'::jsonb
        )
      `;
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        venue: result[0],
        message: 'Venue created successfully',
      }),
    };
  } catch (error) {
    console.error('Error creating venue:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create venue' }),
    };
  }
};