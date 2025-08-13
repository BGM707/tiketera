import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold_out':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Disponible';
      case 'sold_out':
        return 'Agotado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Sin estado';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
            {getStatusText(event.status)}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="capitalize">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span>{formatTime(event.time)} hrs</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="line-clamp-1">{event.venue_name}, {event.venue_city}</span>
          </div>
        </div>

        <Link
          to={`/event/${event.id}`}
          className={`block w-full py-3 px-4 text-center font-semibold rounded-lg transition-all duration-200 ${
            event.status === 'active'
              ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5'
              : event.status === 'sold_out'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {event.status === 'active' ? 'Ver Detalles' : 
           event.status === 'sold_out' ? 'Agotado' : 'No Disponible'}
        </Link>
      </div>
    </div>
  );
}