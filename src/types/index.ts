export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  email_verified: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue_name: string;
  venue_address: string;
  venue_city: string;
  image_url: string;
  category: string;
  status: 'active' | 'sold_out' | 'cancelled';
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  layout: VenueLayout;
}

export interface VenueLayout {
  sections: Section[];
  width: number;
  height: number;
}

export interface Section {
  id: string;
  name: string;
  type: 'general' | 'vip' | 'premium' | 'box';
  price: number;
  color: string;
  seats: Seat[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'sold' | 'reserved';
  x: number;
  y: number;
}

export interface CartItem {
  event_id: string;
  section_id: string;
  seat_id: string;
  price: number;
  event_title: string;
  section_name: string;
  seat_info: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  event_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  purchase_id: string;
  event_id: string;
  section_id: string;
  seat_id: string;
  price: number;
  qr_code: string;
  status: 'active' | 'used' | 'cancelled';
}

export interface AdminUser extends User {
  role: 'admin' | 'super_admin' | 'event_manager';
  permissions: string[];
  last_login: string;
}

export interface EventAnalytics {
  event_id: string;
  total_revenue: number;
  tickets_sold: number;
  tickets_available: number;
  conversion_rate: number;
  daily_sales: { date: string; amount: number; tickets: number }[];
  section_performance: { section_id: string; section_name: string; sold: number; revenue: number }[];
}

export interface DashboardStats {
  total_revenue: number;
  total_events: number;
  total_users: number;
  total_tickets_sold: number;
  monthly_revenue: { month: string; amount: number }[];
  top_events: { event_id: string; title: string; revenue: number; tickets_sold: number }[];
  recent_purchases: Purchase[];
}

export interface EventLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  venue_name: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface SecurityLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  details?: any;
}

export interface RealtimeStats {
  active_users: number;
  current_sales: number;
  pending_payments: number;
  server_status: 'healthy' | 'warning' | 'error';
  last_updated: string;
}