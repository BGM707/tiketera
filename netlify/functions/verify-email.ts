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

  const { token } = requestBody;

  if (!token) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Token is required' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Check if token exists and is not expired
    const tokenRecord = await sql`
      SELECT evt.*, u.id as user_id, u.email
      FROM email_verification_tokens evt
      JOIN users u ON evt.user_id = u.id
      WHERE evt.token = ${token}
        AND evt.expires_at > NOW()
        AND evt.verified_at IS NULL
    `;

    if (tokenRecord.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid or expired token',
          code: 'TOKEN_EXPIRED'
        }),
      };
    }

    const record = tokenRecord[0];

    // Mark token as verified
    await sql`
      UPDATE email_verification_tokens
      SET verified_at = NOW()
      WHERE token = ${token}
    `;

    // Update user email verification status
    await sql`
      UPDATE users
      SET email_verified = true, email = ${record.email}
      WHERE id = ${record.user_id}
    `;

    // Log security event
    await sql`
      INSERT INTO security_logs (user_id, action, ip_address, user_agent, status, details)
      VALUES (
        ${record.user_id},
        'email_verified',
        ${event.headers['x-forwarded-for']?.split(',')[0] || 'unknown'},
        ${event.headers['user-agent'] || 'unknown'},
        'success',
        '{"email": "${record.email}"}'::jsonb
      )
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Email verified successfully',
        email: record.email
      }),
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to verify email' }),
    };
  }
};