import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity,
  Eye,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { RealtimeStats } from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({
    active_users: 1247,
    current_sales: 15,
    pending_payments: 8,
    server_status: 'healthy',
    last_updated: new Date().toISOString(),
  });
  const { getToken } = useAuth();

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const token = getToken();
        if (token) {
          const response = await ApiService.getDashboardStats(token);
          setStats({
            totalStats: {
              total_revenue: response.totalStats?.total_revenue || 0,
              total_events: response.totalStats?.total_events || 0,
              total_users: response.totalStats?.total_users || 0,
              total_tickets_sold: response.totalStats?.total_tickets_sold || 0
            },
            monthlyRevenue: response.monthlyRevenue || [],
            topEvents: response.topEvents || [],
            recentPurchases: response.recentPurchases || [],
            lastUpdated: response.lastUpdated || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        active_users: prev.active_users + Math.floor(Math.random() * 10) - 5,
        current_sales: Math.floor(Math.random() * 25),
        pending_payments: Math.floor(Math.random() * 15),
        last_updated: new Date().toISOString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [getToken]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No se pudieron cargar las estadísticas del dashboard.</p>
      </div>
    );
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const pieData = [
    { name: 'VIP', value: 35, color: '#FFD700' },
    { name: 'Premium', value: 30, color: '#FF6B35' },
    { name: 'General', value: 25, color: '#4ECDC4' },
    { name: 'Palcos', value: 10, color: '#96CEB4' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Última actualización: {new Date(stats.lastUpdated).toLocaleTimeString('es-CL')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Tiempo Real</span>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">{realtimeStats.active_users.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% vs ayer</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Actuales</p>
              <p className="text-2xl font-bold text-gray-900">{realtimeStats.current_sales}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Eye className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">En proceso</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{realtimeStats.pending_payments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">Requieren atención</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
              <p className="text-2xl font-bold text-green-600 capitalize">{realtimeStats.server_status}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-600">Todos los servicios operativos</span>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Ingresos Totales</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalStats?.total_revenue || 0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Usuarios Registrados</p>
              <p className="text-3xl font-bold">{stats.totalStats?.total_users?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Eventos Totales</p>
              <p className="text-3xl font-bold">{stats.totalStats?.total_events || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Tickets Vendidos</p>
              <p className="text-3xl font-bold">{stats.totalStats?.total_tickets_sold?.toLocaleString() || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos Top</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topEvents || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Tickets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compras Recientes</h3>
          <div className="space-y-4">
            {(stats.recentPurchases || []).map((purchase: any) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{purchase.order_number || `Compra #${purchase.id}`}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(purchase.created_at).toLocaleString('es-CL')}
                  </p>
                  {purchase.customer_name && (
                    <p className="text-sm text-gray-500">{purchase.customer_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(purchase.total_amount)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    purchase.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {purchase.status === 'completed' ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}