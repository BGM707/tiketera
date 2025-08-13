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

    const orders = await sql`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        e.title as event_title,
        e.date as event_date,
        e.time as event_time,
        e.venue_name,
        e.venue_address,
        COUNT(t.id) as ticket_count
      FROM orders o
      JOIN events e ON o.event_id = e.id
      LEFT JOIN tickets t ON o.id = t.order_id
      WHERE o.user_id = ${user.sub}
      GROUP BY o.id, o.order_number, o.total_amount, o.status, o.created_at, 
               e.title, e.date, e.time, e.venue_name, e.venue_address
      ORDER BY o.created_at DESC
    `;

    // Get tickets for each order
    const ordersWithTickets = await Promise.all(
      orders.map(async (order) => {
        const tickets = await sql`
          SELECT 
            t.id,
            t.qr_code,
            t.status,
            se.row_name,
            se.seat_number,
            sec.name as section_name,
            t.price
          FROM tickets t
          JOIN seats se ON t.seat_id = se.id
          JOIN sections sec ON t.section_id = sec.id
          WHERE t.order_id = ${order.id}
          ORDER BY sec.name, se.row_name, se.seat_number
        `;

        return {
          ...order,
          tickets: tickets.map(ticket => ({
            id: ticket.id,
            status: ticket.status,
            qr_code: ticket.qr_code,
            seat_info: `${ticket.section_name} - Fila ${ticket.row_name}, Asiento ${ticket.seat_number}`,
            price: ticket.price,
          })),
        };
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ orders: ordersWithTickets }),
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch orders' }),
    };
  }
};