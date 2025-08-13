// src/components/Events/SeatMap.tsx
import { useState, useEffect } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Minus, Plus, ShoppingCart, Clock, Users, Star } from 'lucide-react';
import { Event, Section, Seat } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';

interface SeatMapProps {
  event: Event;
  sections: Section[];
  onBack: () => void;
}

export function SeatMap({ event, sections, onBack }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [zoom, setZoom] = useState(1);
  const { addItem, removeItem, items } = useCart();
  const { getToken } = useAuth();
  const { addNotification } = useNotifications();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer for seat reservation (useEffect en vez de useState)
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTimeLeft(600);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time expired, clear selections
          setSelectedSeats([]);
          items.forEach(item => removeItem(item.seat_id));
          addNotification({
            type: 'warning',
            title: 'Tiempo agotado',
            message: 'La reserva de asientos ha expirado. Por favor, selecciona nuevamente.',
            duration: 5000
          });
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // incluimos deps relevantes para evitar closures stale
  }, [selectedSeats.length, items, removeItem, addNotification]);

  const handleSeatClick = (section: Section, seat: Seat) => {
    if (seat.status === 'sold' || seat.status === 'reserved') return;

    const seatId = seat.id;
    const isSelected = selectedSeats.includes(seatId);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
      removeItem(seatId);
      addNotification({
        type: 'info',
        title: 'Asiento removido',
        message: `${section.name} - Fila ${seat.row}, Asiento ${seat.number}`,
        duration: 2000
      });
    } else {
      if (selectedSeats.length >= 8) {
        addNotification({
          type: 'warning',
          title: 'Límite alcanzado',
          message: 'Máximo 8 asientos por compra',
          duration: 3000
        });
        return;
      }
      
      setSelectedSeats(prev => [...prev, seatId]);
      addItem({
        event_id: event.id,
        section_id: section.id,
        seat_id: seatId,
        price: section.price,
        event_title: event.title,
        section_name: section.name,
        seat_info: `Fila ${seat.row} - Asiento ${seat.number}`,
      });
      addNotification({
        type: 'success',
        title: 'Asiento seleccionado',
        message: `${section.name} - Fila ${seat.row}, Asiento ${seat.number}`,
        duration: 2000
      });
    }
  };

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) return '#22C55E'; // Green
    switch (seat.status) {
      case 'available': return '#E5E7EB'; // Gray
      case 'sold': return '#EF4444'; // Red
      case 'reserved': return '#F59E0B'; // Yellow
      default: return '#E5E7EB';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = 2500;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Evento</span>
            </button>

            <h1 className="text-2xl font-bold text-gray-900 text-center flex-1">
              {event.title} - Selección de Asientos
            </h1>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-110"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-110"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Seat Map */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Stage */}
            <div className="mb-8 text-center">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-12 rounded-2xl inline-block shadow-lg">
                <span className="font-bold text-lg tracking-wider">🎭 ESCENARIO 🎭</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">Vista desde el escenario hacia el público</div>
            </div>

            {/* Map Container */}
            <div 
              className="relative mx-auto bg-gray-100 rounded-lg overflow-hidden"
              style={{ 
                width: 700 * zoom, 
                height: 800 * zoom,
                maxWidth: '100%',
                transform: `scale(${zoom})`,
                transformOrigin: 'center top',
              }}
            >
              {/* Sections */}
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="absolute border-2 border-gray-400 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-lg transform hover:scale-105"
                  style={{
                    left: section.x,
                    top: section.y,
                    width: section.width,
                    height: section.height,
                    backgroundColor: section.color + '40',
                  }}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="p-2 text-center">
                    <div className="font-bold text-sm text-gray-900">
                      {section.name}
                    </div>
                    <div className="text-xs text-gray-700 font-medium">
                      {'$'}{formatPrice(section.price)}
                    </div>
                  </div>

                  {/* Individual Seats */}
                  {selectedSection?.id === section.id && (
                    <div className="absolute inset-2 grid grid-cols-12 gap-1 overflow-hidden">
                      {section.seats.slice(0, 48).map((seat) => (
                        <div
                          key={seat.id}
                          className="w-3 h-3 rounded cursor-pointer border border-gray-400 transition-all duration-200 hover:scale-125 hover:shadow-md"
                          style={{ backgroundColor: getSeatColor(seat) }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeatClick(section, seat);
                          }}
                          title={`Fila ${seat.row} - Asiento ${seat.number} (${seat.status})`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 border border-gray-400 rounded"></div>
                <span className="text-sm">Seleccionado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 border border-gray-400 rounded"></div>
                <span className="text-sm">Vendido</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 border border-gray-400 rounded"></div>
                <span className="text-sm">Reservado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Resumen de Compra
            </h2>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                {items.length}
              </span>
            </div>
          </div>

          {/* Timer */}
          {items.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">Tiempo restante</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 600) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-700 mt-2">
                Los asientos se liberarán automáticamente
              </p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4 text-lg font-medium">
                No has seleccionado ningún asiento
              </p>
              <p className="text-sm text-gray-500">
                Haz clic en una sección del mapa para ver los asientos disponibles
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-64 overflow-auto">
                {items.map((item) => (
                  <div key={item.seat_id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-bold text-sm text-gray-900">{item.section_name}</span>
                        <p className="text-xs text-gray-600">{item.seat_info}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">Excelente ubicación</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.seat_id);
                          setSelectedSeats(prev => prev.filter(id => id !== item.seat_id));
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition-all duration-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-gray-900">{'$'}{formatPrice(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900">Subtotal:</span>
                    <span className="font-bold text-lg text-gray-900">{'$'}{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Cargo por servicio:</span>
                    <span className="text-gray-600">{'$'}{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-900">Total:</span>
                      <span className="font-bold text-2xl text-blue-600">{'$'}{formatPrice(subtotal + serviceFee)}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
                >
                  Proceder al Pago ({items.length} ticket{items.length !== 1 ? 's' : ''})
                </button>

                <p className="text-xs text-gray-600 text-center mt-3">
                  🔒 Compra segura con encriptación SSL
                </p>
              </div>
            </>
          )}

          {/* Section Info */}
          {selectedSection && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-xl mb-3 text-gray-900">{selectedSection.name}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700">
                  Precio: <span className="font-bold text-lg text-blue-600">{'$'}{formatPrice(selectedSection.price)}</span>
                </p>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Capacidad: 240 personas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">Vista: Excelente</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 bg-white/70 p-2 rounded-lg">
                💡 Haz clic en los asientos individuales para seleccionarlos. Máximo 8 asientos por compra.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
