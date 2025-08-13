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

    // Get total stats
    const totalStats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM events WHERE status = 'active') as total_events,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT COUNT(*) FROM venues WHERE status = 'active') as total_venues,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM tickets WHERE status = 'active') as total_tickets_sold
    `;

    // Get monthly revenue (last 12 months)
    const monthlyRevenue = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
        COALESCE(SUM(total_amount), 0) as amount
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `;

    // Get top events by revenue
    const topEvents = await sql`
      SELECT 
        e.id as event_id,
        e.title,
        COALESCE(SUM(o.total_amount), 0) as revenue,
        COUNT(t.id) as tickets_sold
      FROM events e
      LEFT JOIN orders o ON e.id = o.event_id AND o.status = 'completed'
      LEFT JOIN tickets t ON o.id = t.order_id
      WHERE e.status = 'active'
      GROUP BY e.id, e.title
      ORDER BY revenue DESC
      LIMIT 5
    `;

    // Get recent purchases
    const recentPurchases = await sql`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        e.title as event_title,
        u.first_name || ' ' || u.last_name as customer_name
      FROM orders o
      JOIN events e ON o.event_id = e.id
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `;

    // Get event status distribution
    const eventStats = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM events
      GROUP BY status
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalStats: totalStats[0],
        monthlyRevenue,
        topEvents,
        recentPurchases,
        eventStats,
        lastUpdated: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch dashboard statistics' }),
    };
  }
};