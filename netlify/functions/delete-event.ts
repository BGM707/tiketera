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

  if (event.httpMethod !== 'DELETE') {
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
  if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Super admin access required' }),
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

    // Check if event exists and has no active orders
    const eventCheck = await sql`
      SELECT 
        e.id,
        COUNT(o.id) as active_orders
      FROM events e
      LEFT JOIN orders o ON e.id = o.event_id AND o.status IN ('pending', 'completed')
      WHERE e.id = ${eventId}
      GROUP BY e.id
    `;

    if (eventCheck.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Event not found' }),
      };
    }

    if (eventCheck[0].active_orders > 0) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ 
          error: 'Cannot delete event with active orders. Cancel the event instead.' 
        }),
      };
    }

    // Soft delete - mark as cancelled instead of hard delete
    await sql`
      UPDATE events 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${eventId}
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Event cancelled successfully',
      }),
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete event' }),
    };
  }
};