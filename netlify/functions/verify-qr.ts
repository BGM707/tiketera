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

  const { qr_code } = requestBody;

  if (!qr_code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'QR code is required' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Get ticket information from QR code
    const ticketInfo = await sql`
      SELECT 
        t.id,
        t.ticket_number,
        t.status,
        t.used_at,
        t.price,
        e.title as event_title,
        e.date as event_date,
        e.time as event_time,
        e.venue_name,
        e.venue_address,
        s.name as section_name,
        se.row_name,
        se.seat_number,
        u.first_name,
        u.last_name,
        u.email,
        o.order_number
      FROM tickets t
      JOIN orders o ON t.order_id = o.id
      JOIN events e ON t.event_id = e.id
      JOIN sections s ON t.section_id = s.id
      JOIN seats se ON t.seat_id = se.id
      JOIN users u ON o.user_id = u.id
      WHERE t.qr_code = ${qr_code}
    `;

    if (ticketInfo.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Ticket not found',
          valid: false 
        }),
      };
    }

    const ticket = ticketInfo[0];

    // Check if ticket is valid
    const isValid = ticket.status === 'active';
    const isUsed = ticket.used_at !== null;
    const eventDate = new Date(ticket.event_date);
    const today = new Date();
    const isEventDay = eventDate.toDateString() === today.toDateString();

    let validationStatus = 'valid';
    let message = 'Ticket válido';

    if (ticket.status === 'cancelled') {
      validationStatus = 'cancelled';
      message = 'Ticket cancelado';
    } else if (ticket.status === 'refunded') {
      validationStatus = 'refunded';
      message = 'Ticket reembolsado';
    } else if (isUsed) {
      validationStatus = 'used';
      message = `Ticket ya utilizado el ${new Date(ticket.used_at).toLocaleString('es-CL')}`;
    } else if (!isEventDay) {
      validationStatus = 'wrong_date';
      message = `Este ticket es para el ${eventDate.toLocaleDateString('es-CL')}`;
    }

    // If ticket is valid and not used, mark as used
    if (isValid && !isUsed && isEventDay) {
      await sql`
        UPDATE tickets 
        SET status = 'used', used_at = NOW(), used_by = 'scanner'
        WHERE id = ${ticket.id}
      `;

      // Log the ticket usage
      await sql`
        INSERT INTO security_logs (action, resource, resource_id, status, details)
        VALUES (
          'ticket_scanned',
          'ticket',
          ${ticket.id},
          'success',
          '{"ticket_number": "${ticket.ticket_number}", "event": "${ticket.event_title}"}'::jsonb
        )
      `;

      validationStatus = 'validated';
      message = 'Ticket validado correctamente';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: isValid && !isUsed && isEventDay,
        status: validationStatus,
        message,
        ticket: {
          ticket_number: ticket.ticket_number,
          event_title: ticket.event_title,
          event_date: ticket.event_date,
          event_time: ticket.event_time,
          venue_name: ticket.venue_name,
          venue_address: ticket.venue_address,
          section_name: ticket.section_name,
          seat_info: `Fila ${ticket.row_name} - Asiento ${ticket.seat_number}`,
          customer_name: `${ticket.first_name} ${ticket.last_name}`,
          customer_email: ticket.email,
          order_number: ticket.order_number,
          price: ticket.price,
          used_at: ticket.used_at
        }
      }),
    };
  } catch (error) {
    console.error('Error verifying QR code:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify QR code',
        valid: false 
      }),
    };
  }
};