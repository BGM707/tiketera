import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { NotificationProvider } from './hooks/useNotifications';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { AdminLayout } from './components/Admin/AdminLayout';
import { Dashboard } from './components/Admin/Dashboard';
import { EventManagement } from './components/Admin/EventManagement';
import { Home } from './pages/Home';
import { MyAccount } from './pages/MyAccount';
import { HelpCenter } from './pages/HelpCenter';
import { Contact } from './pages/Contact';
import { RefundPolicy } from './pages/RefundPolicy';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { QRScanner } from './pages/QRScanner';
import { EventDetail } from './components/Events/EventDetail';
import { LoginForm } from './components/Auth/LoginForm';
import { useAuth } from './hooks/useAuth';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="events" element={<EventManagement />} />
                <Route path="users" element={<div className="p-6">Gestión de Usuarios - En desarrollo</div>} />
                <Route path="analytics" element={<div className="p-6">Analytics Avanzados - En desarrollo</div>} />
                <Route path="finances" element={<div className="p-6">Reportes Financieros - En desarrollo</div>} />
                <Route path="venues" element={<div className="p-6">Gestión de Venues - En desarrollo</div>} />
                <Route path="security" element={<div className="p-6">Logs de Seguridad - En desarrollo</div>} />
                <Route path="settings" element={<div className="p-6">Configuración del Sistema - En desarrollo</div>} />
                <Route path="scanner" element={<QRScanner />} />
              </Route>

              {/* Public Routes */}
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/event/:id" element={<EventDetail />} />
                      <Route path="/my-account" element={<MyAccount />} />
                      <Route path="/my-tickets" element={<MyAccount />} />
                      <Route path="/my-orders" element={<MyAccount />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/refunds" element={<RefundPolicy />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsConditions />} />
                      <Route path="/login" element={<LoginForm />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;