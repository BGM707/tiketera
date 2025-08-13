import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, Heart, ArrowLeft, Star, Users, Zap, Shield, Music, Sparkles } from 'lucide-react';
import { Event, Section } from '../../types';
import { ApiService } from '../../services/api';
import { SeatMap } from './SeatMap';
import { useNotifications } from '../../hooks/useNotifications';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareCount, setShareCount] = useState(1247);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const response = await ApiService.getEvent(id);
        setEvent(response.event);
        setSections(response.sections);
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    addNotification({
      type: 'success',
      title: isLiked ? 'Removido de favoritos' : 'Agregado a favoritos',
      message: isLiked ? 'El evento fue removido de tu lista de favoritos' : 'El evento fue agregado a tu lista de favoritos',
      duration: 3000
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCount(prev => prev + 1);
    addNotification({
      type: 'success',
      title: 'Enlace copiado',
      message: 'El enlace del evento fue copiado al portapapeles',
      duration: 3000
    });
  };

  if (showSeatMap) {
    return <SeatMap event={event} sections={sections} onBack={() => setShowSeatMap(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute bottom-60 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40"></div>
        </div>
        
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-black/50 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                {event.category}
              </span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                Disponible
              </span>
              <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-lg">
              <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Calendar className="w-5 h-5" />
                <span className="capitalize">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5" />
                <span>{formatTime(event.time)} hrs</span>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <MapPin className="w-5 h-5" />
                <span>{event.venue_name}</span>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Users className="w-5 h-5" />
                <span>1,250 personas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Highlights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                Destacados del Evento
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Audio Premium</p>
                    <p className="text-sm text-gray-600">Sistema de sonido 5.1</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Energía 100% Renovable</p>
                    <p className="text-sm text-gray-600">Generación eco-amigable</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Seguridad</p>
                    <p className="text-sm text-gray-600">Personal capacitado 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <p className="text-lg text-gray-700">{event.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Ticket Purchase */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compra tu entrada</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xl font-semibold">Entrada General</p>
                <p className="text-xl font-semibold text-green-600">$25.000 CLP</p>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300">
                Comprar ahora
              </button>
            </div>

            {/* Like and Share */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <button onClick={handleLike} className="text-red-600 hover:text-red-700">
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-600' : 'fill-current'}`} />
                </button>
                <div className="text-center">
                  <button
                    onClick={handleShare}
                    className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
                  >
                    Compartir
                  </button>
                  <p className="text-sm text-gray-500">{shareCount} veces compartido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
