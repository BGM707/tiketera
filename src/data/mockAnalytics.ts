import { DashboardStats, EventAnalytics } from '../types';

export const mockDashboardStats: DashboardStats = {
  total_revenue: 45750000,
  total_events: 156,
  total_users: 12847,
  total_tickets_sold: 8934,
  monthly_revenue: [
    { month: 'Ene', amount: 3200000 },
    { month: 'Feb', amount: 2800000 },
    { month: 'Mar', amount: 4100000 },
    { month: 'Abr', amount: 3900000 },
    { month: 'May', amount: 5200000 },
    { month: 'Jun', amount: 4800000 },
    { month: 'Jul', amount: 6100000 },
    { month: 'Ago', amount: 5500000 },
    { month: 'Sep', amount: 4700000 },
    { month: 'Oct', amount: 5800000 },
    { month: 'Nov', amount: 6200000 },
    { month: 'Dic', amount: 7450000 },
  ],
  top_events: [
    { event_id: '1', title: 'Festival de Rock Nacional 2024', revenue: 8500000, tickets_sold: 1200 },
    { event_id: '3', title: 'Festival Electrónico Neón', revenue: 6200000, tickets_sold: 890 },
    { event_id: '6', title: 'Concierto Pop Internacional', revenue: 5800000, tickets_sold: 750 },
    { event_id: '2', title: 'Concierto Sinfónico de Primavera', revenue: 4100000, tickets_sold: 650 },
    { event_id: '5', title: 'Espectáculo de Danza Contemporánea', revenue: 2900000, tickets_sold: 420 },
  ],
  recent_purchases: [
    {
      id: 'p1',
      user_id: 'u1',
      event_id: '1',
      total_amount: 150000,
      status: 'completed',
      created_at: '2024-01-15T14:30:00Z',
      tickets: [],
    },
    {
      id: 'p2',
      user_id: 'u2',
      event_id: '3',
      total_amount: 80000,
      status: 'completed',
      created_at: '2024-01-15T13:45:00Z',
      tickets: [],
    },
    {
      id: 'p3',
      user_id: 'u3',
      event_id: '2',
      total_amount: 120000,
      status: 'pending',
      created_at: '2024-01-15T12:20:00Z',
      tickets: [],
    },
  ],
};

export const mockEventAnalytics: { [key: string]: EventAnalytics } = {
  '1': {
    event_id: '1',
    total_revenue: 8500000,
    tickets_sold: 1200,
    tickets_available: 300,
    conversion_rate: 0.78,
    daily_sales: [
      { date: '2024-01-10', amount: 450000, tickets: 65 },
      { date: '2024-01-11', amount: 680000, tickets: 89 },
      { date: '2024-01-12', amount: 520000, tickets: 72 },
      { date: '2024-01-13', amount: 890000, tickets: 124 },
      { date: '2024-01-14', amount: 1200000, tickets: 156 },
      { date: '2024-01-15', amount: 980000, tickets: 134 },
    ],
    section_performance: [
      { section_id: 'vip', section_name: 'VIP', sold: 180, revenue: 2700000 },
      { section_id: 'premium', section_name: 'Premium', sold: 320, revenue: 2560000 },
      { section_id: 'general-1', section_name: 'Platea General A', sold: 450, revenue: 2025000 },
      { section_id: 'general-2', section_name: 'Platea General B', sold: 250, revenue: 875000 },
    ],
  },
};