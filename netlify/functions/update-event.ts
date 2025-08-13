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

  if (event.httpMethod !== 'PUT') {
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

  const eventId = event.queryStringParameters?.id;
  if (!eventId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Event ID is required' }),
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
    status,
  } = requestBody;

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Check if event exists
    const existingEvent = await sql`
      SELECT id FROM events WHERE id = ${eventId}
    `;

    if (existingEvent.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    const result = await sql`
      UPDATE events 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        date = COALESCE(${date}, date),
        time = COALESCE(${time}, time),
        venue_name = COALESCE(${venue_name}, venue_name),
        venue_address = COALESCE(${venue_address}, venue_address),
        venue_city = COALESCE(${venue_city}, venue_city),
        image_url = COALESCE(${image_url}, image_url),
        category = COALESCE(${category}, category),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${eventId}
      RETURNING *
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        event: result[0],
        message: 'Event updated successfully',
      }),
    };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update event' }),
    };
  }
};