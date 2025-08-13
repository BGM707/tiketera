import { Handler } from '@netlify/functions';
import { neon } from '@netlify/neon';
import { randomBytes } from 'crypto';

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

  const { email } = requestBody;

  if (!email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Email is required' }),
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Check if user exists
    const user = await sql`
      SELECT id, email
      FROM users
      WHERE email = ${email} AND status = 'active'
    `;

    if (user.length === 0) {
      // Don't reveal if user exists or not for security
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'If the email exists, a password reset link has been sent'
        }),
      };
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate old tokens
    await sql`
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE user_id = ${user[0].id} AND used_at IS NULL
    `;

    // Create new reset token
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user[0].id}, ${token}, ${expiresAt})
    `;

    // Log security event
    await sql`
      INSERT INTO security_logs (user_id, action, ip_address, user_agent, status, details)
      VALUES (
        ${user[0].id},
        'password_reset_requested',
        ${event.headers['x-forwarded-for']?.split(',')[0] || 'unknown'},
        ${event.headers['user-agent'] || 'unknown'},
        'success',
        '{"email": "${email}"}'::jsonb
      )
    `;

    // In a real implementation, you would send an email here
    console.log(`Password reset email would be sent to ${email} with token: ${token}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'If the email exists, a password reset link has been sent',
        // In development, include the token for testing
        ...(process.env.NODE_ENV === 'development' && { token })
      }),
    };
  } catch (error) {
    console.error('Error processing password reset:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process password reset' }),
    };
  }
};