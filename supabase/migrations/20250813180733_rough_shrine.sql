/*
  # Schema inicial para sistema de ticketing

  1. Tablas principales
    - `events` - Eventos y espectáculos
    - `venues` - Lugares y recintos
    - `sections` - Secciones de cada venue
    - `seats` - Asientos individuales
    - `orders` - Órdenes de compra
    - `tickets` - Tickets individuales
    - `users` - Usuarios del sistema (complementa Netlify Identity)
    - `admin_users` - Usuarios administradores
    - `security_logs` - Logs de seguridad

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas específicas por rol
    - Logs de auditoría

  3. Índices y constraints
    - Optimización para consultas frecuentes
    - Integridad referencial
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Netlify Identity)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  netlify_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  phone text,
  date_of_birth date,
  profile_image_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  email_verified boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted'))
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'event_manager', 'support')),
  permissions jsonb DEFAULT '[]',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text DEFAULT 'Chile',
  postal_code text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  capacity integer NOT NULL DEFAULT 0,
  description text,
  amenities jsonb DEFAULT '[]',
  contact_info jsonb DEFAULT '{}',
  images jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance'))
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text,
  date date NOT NULL,
  time time NOT NULL,
  end_time time,
  venue_id uuid REFERENCES venues(id) ON DELETE RESTRICT,
  venue_name text NOT NULL, -- Denormalized for performance
  venue_address text NOT NULL,
  venue_city text NOT NULL,
  image_url text,
  gallery_images jsonb DEFAULT '[]',
  category text NOT NULL,
  tags jsonb DEFAULT '[]',
  age_restriction text,
  dress_code text,
  special_instructions text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sold_out', 'cancelled', 'postponed', 'completed')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  sales_start_date timestamptz DEFAULT now(),
  sales_end_date timestamptz,
  max_tickets_per_order integer DEFAULT 8,
  is_featured boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES venues(id) ON DELETE RESTRICT,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('general', 'vip', 'premium', 'box', 'standing')),
  price decimal(10, 2) NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  description text,
  color text DEFAULT '#E5E7EB',
  position_data jsonb DEFAULT '{}', -- For seat map positioning
  amenities jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Seats table
CREATE TABLE IF NOT EXISTS seats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  row_name text NOT NULL,
  seat_number integer NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'blocked')),
  position_x decimal(8, 2) DEFAULT 0,
  position_y decimal(8, 2) DEFAULT 0,
  reserved_until timestamptz,
  reserved_by uuid REFERENCES users(id),
  accessibility_features jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, row_name, seat_number)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE RESTRICT,
  event_id uuid REFERENCES events(id) ON DELETE RESTRICT,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed')),
  subtotal decimal(10, 2) NOT NULL DEFAULT 0,
  service_fee decimal(10, 2) NOT NULL DEFAULT 0,
  taxes decimal(10, 2) NOT NULL DEFAULT 0,
  total_amount decimal(10, 2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'CLP',
  payment_method text,
  payment_id text,
  payment_status text DEFAULT 'pending',
  billing_info jsonb DEFAULT '{}',
  notes text,
  expires_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE RESTRICT,
  event_id uuid REFERENCES events(id) ON DELETE RESTRICT,
  section_id uuid REFERENCES sections(id) ON DELETE RESTRICT,
  seat_id uuid REFERENCES seats(id) ON DELETE RESTRICT,
  ticket_number text UNIQUE NOT NULL,
  price decimal(10, 2) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled', 'refunded')),
  qr_code text UNIQUE,
  barcode text UNIQUE,
  used_at timestamptz,
  used_by text,
  transfer_history jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  resource text,
  resource_id text,
  ip_address inet,
  user_agent text,
  status text NOT NULL CHECK (status IN ('success', 'failed', 'blocked')),
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  email text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_seats_section ON seats(section_id);
CREATE INDEX IF NOT EXISTS idx_seats_status ON seats(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_tickets_order ON tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON security_logs(created_at);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (netlify_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (netlify_id = auth.jwt() ->> 'sub');

-- Admin users policies
CREATE POLICY "Admins can read admin data" ON admin_users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.netlify_id = auth.jwt() ->> 'sub' 
      AND u.id = admin_users.user_id
    )
  );

-- Events policies (public read, admin write)
CREATE POLICY "Anyone can read active events" ON events
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage events" ON events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = auth.jwt() ->> 'sub'
      AND au.is_active = true
    )
  );

-- Venues policies
CREATE POLICY "Anyone can read active venues" ON venues
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage venues" ON venues
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = auth.jwt() ->> 'sub'
      AND au.is_active = true
    )
  );

-- Sections policies
CREATE POLICY "Anyone can read sections" ON sections
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage sections" ON sections
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = auth.jwt() ->> 'sub'
      AND au.is_active = true
    )
  );

-- Seats policies
CREATE POLICY "Anyone can read available seats" ON seats
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Users can reserve seats" ON seats
  FOR UPDATE TO authenticated
  USING (
    status = 'available' OR 
    reserved_by = (
      SELECT id FROM users WHERE netlify_id = auth.jwt() ->> 'sub'
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT TO authenticated
  USING (
    user_id = (
      SELECT id FROM users WHERE netlify_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (
      SELECT id FROM users WHERE netlify_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = auth.jwt() ->> 'sub'
      AND au.is_active = true
    )
  );

-- Tickets policies
CREATE POLICY "Users can read own tickets" ON tickets
  FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE user_id = (
        SELECT id FROM users WHERE netlify_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- Security logs policies (admin only)
CREATE POLICY "Admins can read security logs" ON security_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN users u ON au.user_id = u.id
      WHERE u.netlify_id = auth.jwt() ->> 'sub'
      AND au.is_active = true
      AND au.role IN ('super_admin', 'admin')
    )
  );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON seats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'TK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'TIC' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('ticket_number_seq')::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id uuid,
  p_action text,
  p_resource text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_status text DEFAULT 'success',
  p_details jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO security_logs (
    user_id, action, resource, resource_id, 
    ip_address, user_agent, status, details
  ) VALUES (
    p_user_id, p_action, p_resource, p_resource_id,
    p_ip_address, p_user_agent, p_status, p_details
  );
END;
$$ LANGUAGE plpgsql;