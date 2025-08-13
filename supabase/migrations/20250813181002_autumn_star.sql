/*
  # Datos iniciales para el sistema

  1. Usuarios administradores
  2. Venues de ejemplo
  3. Eventos de muestra
  4. Secciones y asientos
*/

-- Insert sample venues first
INSERT INTO venues (id, name, address, city, country, capacity, description, latitude, longitude, amenities, contact_info) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Estadio Nacional',
    'Av. Grecia 2001',
    'Santiago',
    'Chile',
    48000,
    'El estadio más grande de Chile, ideal para grandes eventos y conciertos.',
    -33.4569,
    -70.6108,
    '["parking", "food_court", "accessibility", "security", "restrooms", "merchandise"]'::jsonb,
    '{"phone": "+56 2 2238 8102", "email": "info@estadionacional.cl", "website": "https://estadionacional.cl"}'::jsonb
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Teatro Municipal',
    'Plaza Baquedano s/n',
    'Santiago',
    'Chile',
    1500,
    'Teatro histórico con excelente acústica para espectáculos culturales.',
    -33.4372,
    -70.6344,
    '["valet_parking", "bar", "accessibility", "coat_check", "premium_seating"]'::jsonb,
    '{"phone": "+56 2 2463 3000", "email": "contacto@municipal.cl", "website": "https://municipal.cl"}'::jsonb
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Movistar Arena',
    'Av. Beauchef 1204',
    'Santiago',
    'Chile',
    15000,
    'Arena moderna con tecnología de punta para conciertos y eventos deportivos.',
    -33.4569,
    -70.6693,
    '["parking", "food_court", "vip_lounges", "accessibility", "merchandise", "premium_bars"]'::jsonb,
    '{"phone": "+56 2 2420 8000", "email": "info@movistar-arena.cl", "website": "https://movistar-arena.cl"}'::jsonb
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'Centro Cultural Matucana 100',
    'Matucana 100',
    'Santiago',
    'Chile',
    800,
    'Espacio cultural alternativo para eventos artísticos y culturales.',
    -33.4372,
    -70.6693,
    '["cafe", "gallery", "accessibility", "workshop_spaces", "outdoor_area"]'::jsonb,
    '{"phone": "+56 2 2681 8030", "email": "info@m100.cl", "website": "https://m100.cl"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (
  id, title, description, short_description, date, time, end_time,
  venue_id, venue_name, venue_address, venue_city,
  image_url, category, tags, status, is_featured,
  sales_start_date, sales_end_date, max_tickets_per_order
) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'Festival de Rock Nacional 2024',
    'Los mejores exponentes del rock nacional se reúnen en una noche épica. Con bandas legendarias como Los Prisioneros, Lucybell, y nuevos talentos emergentes. Una celebración de la música chilena que no te puedes perder.',
    'Festival épico de rock nacional con las mejores bandas',
    '2024-03-15',
    '20:00',
    '02:00',
    '550e8400-e29b-41d4-a716-446655440001',
    'Estadio Nacional',
    'Av. Grecia 2001',
    'Santiago',
    'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Música',
    '["rock", "nacional", "festival", "bandas"]'::jsonb,
    'active',
    true,
    now() - interval '30 days',
    '2024-03-14 23:59:59',
    8
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Concierto Sinfónico de Primavera',
    'La Orquesta Sinfónica Nacional presenta un espectáculo único con las mejores melodías clásicas de todos los tiempos. Una experiencia musical inolvidable en el histórico Teatro Municipal.',
    'Concierto sinfónico con la Orquesta Nacional',
    '2024-04-20',
    '19:30',
    '22:00',
    '550e8400-e29b-41d4-a716-446655440002',
    'Teatro Municipal',
    'Plaza Baquedano s/n',
    'Santiago',
    'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Clásica',
    '["sinfónico", "clásica", "orquesta", "cultural"]'::jsonb,
    'active',
    true,
    now() - interval '20 days',
    '2024-04-19 23:59:59',
    6
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'Festival Electrónico Neón',
    'Una noche de música electrónica con los mejores DJs internacionales. Experiencia audiovisual inmersiva con tecnología de punta y efectos especiales únicos.',
    'Festival de música electrónica con DJs internacionales',
    '2024-05-10',
    '22:00',
    '06:00',
    '550e8400-e29b-41d4-a716-446655440003',
    'Movistar Arena',
    'Av. Beauchef 1204',
    'Santiago',
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Electrónica',
    '["electrónica", "dj", "festival", "tecnología"]'::jsonb,
    'active',
    true,
    now() - interval '15 days',
    '2024-05-09 23:59:59',
    8
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    'Stand Up Comedy Night',
    'Los comediantes más divertidos del país se reúnen para una noche llena de risas y entretenimiento. Humor inteligente y situaciones hilarantes.',
    'Noche de stand up comedy con los mejores comediantes',
    '2024-03-25',
    '21:00',
    '23:30',
    '550e8400-e29b-41d4-a716-446655440004',
    'Centro Cultural Matucana 100',
    'Matucana 100',
    'Santiago',
    'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Comedy',
    '["comedy", "humor", "stand-up", "entretenimiento"]'::jsonb,
    'active',
    false,
    now() - interval '10 days',
    '2024-03-24 23:59:59',
    4
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sections for each event
-- Estadio Nacional sections (Festival de Rock)
INSERT INTO sections (id, event_id, venue_id, name, type, price, capacity, description, color, position_data) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'VIP Cancha', 'vip', 150000, 500, 'Acceso VIP con vista privilegiada al escenario', '#FFD700', '{"x": 200, "y": 100, "width": 300, "height": 120}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Platea Premium', 'premium', 80000, 1000, 'Platea con excelente vista y servicios premium', '#FF6B35', '{"x": 50, "y": 250, "width": 600, "height": 140}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Platea General', 'general', 45000, 2000, 'Platea general con buena vista al escenario', '#4ECDC4', '{"x": 50, "y": 420, "width": 600, "height": 160}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Galería', 'general', 25000, 3000, 'Galería alta con vista panorámica', '#45B7D1', '{"x": 50, "y": 600, "width": 600, "height": 160}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Teatro Municipal sections (Concierto Sinfónico)
INSERT INTO sections (id, event_id, venue_id, name, type, price, capacity, description, color, position_data) VALUES
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Platea Orquesta', 'premium', 65000, 300, 'Platea principal con la mejor acústica', '#FFD700', '{"x": 150, "y": 200, "width": 400, "height": 100}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Palcos Laterales', 'box', 85000, 80, 'Palcos exclusivos con servicio personalizado', '#96CEB4', '{"x": 50, "y": 150, "width": 80, "height": 80}'::jsonb),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Galería', 'general', 35000, 400, 'Galería con vista elevada', '#4ECDC4', '{"x": 100, "y": 50, "width": 500, "height": 80}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Generate sample seats for VIP section
DO $$
DECLARE
  section_id uuid := '770e8400-e29b-41d4-a716-446655440001';
  row_letter char;
  seat_num int;
  seat_status text;
BEGIN
  FOR row_num IN 1..10 LOOP
    row_letter := chr(64 + row_num); -- A, B, C, etc.
    FOR seat_num IN 1..50 LOOP
      -- Randomly assign seat status for demo
      seat_status := CASE 
        WHEN random() < 0.7 THEN 'available'
        WHEN random() < 0.9 THEN 'sold'
        ELSE 'reserved'
      END;
      
      INSERT INTO seats (
        section_id, row_name, seat_number, status,
        position_x, position_y
      ) VALUES (
        section_id, row_letter, seat_num, seat_status,
        seat_num * 6, row_num * 12
      );
    END LOOP;
  END LOOP;
END $$;