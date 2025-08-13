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
      SELECT id, email, email_verified
      FROM users
      WHERE email = ${email}
    `;

    if (user.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    if (user[0].email_verified) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email already verified' }),
      };
    }

    // Generate new verification token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Invalidate old tokens
    await sql`
      UPDATE email_verification_tokens
      SET verified_at = NOW()
      WHERE user_id = ${user[0].id} AND verified_at IS NULL
    `;

    // Create new verification token
    await sql`
      INSERT INTO email_verification_tokens (user_id, token, email, expires_at)
      VALUES (${user[0].id}, ${token}, ${email}, ${expiresAt})
    `;

    // In a real implementation, you would send an email here
    // For now, we'll just log it
    console.log(`Verification email would be sent to ${email} with token: ${token}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Verification email sent successfully',
        // In development, include the token for testing
        ...(process.env.NODE_ENV === 'development' && { token })
      }),
    };
  } catch (error) {
    console.error('Error resending verification:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to resend verification email' }),
    };
  }
};