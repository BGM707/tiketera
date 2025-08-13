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

  try {
    const user = context.clientContext?.user;
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'No user found' }),
      };
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL!);

    // Check if user exists, if not create them
    const existingUser = await sql`
      SELECT id, email FROM users WHERE netlify_id = ${user.sub}
    `;

    let userData;
    if (existingUser.length === 0) {
      // Create new user
      const newUser = await sql`
        INSERT INTO users (
          netlify_id, email, first_name, last_name, 
          email_verified, status, last_login
        ) VALUES (
          ${user.sub},
          ${user.email},
          ${user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || ''},
          ${user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || ''},
          ${user.email_verified_at !== null},
          'active',
          NOW()
        )
        RETURNING *
      `;
      userData = newUser[0];

      // Check if this email should be an admin
      const adminEmails = ['beenja74@gmail.com', 'elfukoenpatines@gmail.com'];
      if (adminEmails.includes(user.email)) {
        await sql`
          INSERT INTO admin_users (user_id, role, permissions, is_active)
          VALUES (
            ${userData.id},
            'super_admin',
            '["manage_events", "manage_users", "view_analytics", "financial_reports", "manage_venues", "security_logs", "system_settings", "view_dashboard", "scan_tickets"]'::jsonb,
            true
          )
        `;
      }
    } else {
      // Update last login
      await sql`
        UPDATE users 
        SET last_login = NOW()
        WHERE netlify_id = ${user.sub}
      `;
      userData = existingUser[0];
    }

    // Check if user is admin
    const adminCheck = await sql`
      SELECT au.role, au.permissions 
      FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = ${user.sub} AND au.is_active = true
    `;

    const isAdmin = adminCheck.length > 0;
    const adminRole = isAdmin ? adminCheck[0].role : null;
    const permissions = isAdmin ? adminCheck[0].permissions : [];

    // Log security event
    await sql`
      INSERT INTO security_logs (user_id, action, ip_address, user_agent, status, details)
      VALUES (
        ${userData.id},
        'login',
        ${event.headers['x-forwarded-for']?.split(',')[0] || event.headers['x-real-ip'] || 'unknown'},
        ${event.headers['user-agent'] || 'unknown'},
        'success',
        '{"method": "netlify_identity", "is_admin": ${isAdmin}}'::jsonb
      )
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        user: userData,
        isAdmin,
        adminRole,
        permissions,
        message: 'User authenticated successfully'
      }),
    };
  } catch (error) {
    console.error('Auth callback error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Authentication failed' }),
    };
  }
};