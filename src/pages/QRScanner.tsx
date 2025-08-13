import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, AlertTriangle, Camera, User, MapPin, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface TicketInfo {
  ticket_number: string;
  event_title: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  section_name: string;
  seat_info: string;
  customer_name: string;
  customer_email: string;
  order_number: string;
  price: number;
  used_at?: string;
}

interface ScanResult {
  valid: boolean;
  status: string;
  message: string;
  ticket?: TicketInfo;
}

export function QRScanner() {
  const { isAdmin, checkPermission } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not admin
  if (!isAdmin || !checkPermission('scan_tickets')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder al escáner de QR.</p>
        </div>
      </div>
    );
  }

  const handleScan = async () => {
    if (!qrCode.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code: qrCode.trim() })
      });

      const result = await response.json();
      setScanResult(result);
    } catch (error) {
      setScanResult({
        valid: false,
        status: 'error',
        message: 'Error al verificar el código QR'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
      case 'validated':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'used':
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'wrong_date':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
      case 'validated':
        return 'bg-green-50 border-green-200';
      case 'used':
      case 'cancelled':
      case 'refunded':
        return 'bg-red-50 border-red-200';
      case 'wrong_date':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escáner de Tickets</h1>
          <p className="text-gray-600">Verifica la validez de los tickets escaneando el código QR</p>
        </div>

        {/* Scanner Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="max-w-md mx-auto">
            <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
              Código QR del Ticket
            </label>
            <div className="flex space-x-4">
              <input
                id="qr-input"
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Ingresa o escanea el código QR"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              />
              <button
                onClick={handleScan}
                disabled={loading || !qrCode.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <span>{loading ? 'Verificando...' : 'Verificar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className={`rounded-xl border-2 p-8 ${getStatusColor(scanResult.status)}`}>
            <div className="text-center mb-6">
              {getStatusIcon(scanResult.status)}
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {scanResult.message}
              </h2>
            </div>

            {scanResult.ticket && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Información del Evento
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Evento</p>
                        <p className="text-gray-900 font-semibold">{scanResult.ticket.event_title}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Fecha</p>
                            <p className="text-gray-900">{formatDate(scanResult.ticket.event_date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Hora</p>
                            <p className="text-gray-900">{scanResult.ticket.event_time}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Venue</p>
                          <p className="text-gray-900">{scanResult.ticket.venue_name}</p>
                          <p className="text-sm text-gray-600">{scanResult.ticket.venue_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Información del Ticket
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Número de Ticket</p>
                        <p className="text-gray-900 font-mono">{scanResult.ticket.ticket_number}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sección y Asiento</p>
                        <p className="text-gray-900">{scanResult.ticket.section_name}</p>
                        <p className="text-gray-600">{scanResult.ticket.seat_info}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Comprador</p>
                          <p className="text-gray-900">{scanResult.ticket.customer_name}</p>
                          <p className="text-sm text-gray-600">{scanResult.ticket.customer_email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Precio</p>
                        <p className="text-gray-900 font-semibold">{formatCurrency(scanResult.ticket.price)}</p>
                      </div>

                      {scanResult.ticket.used_at && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Usado el</p>
                          <p className="text-gray-900">{new Date(scanResult.ticket.used_at).toLocaleString('es-CL')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <strong>Orden:</strong> {scanResult.ticket.order_number}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Instrucciones de Uso</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Escanea o ingresa manualmente el código QR del ticket</li>
            <li>• El sistema verificará automáticamente la validez del ticket</li>
            <li>• Los tickets válidos se marcarán como "usados" después de la verificación</li>
            <li>• Los tickets ya usados, cancelados o para fechas incorrectas serán rechazados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}