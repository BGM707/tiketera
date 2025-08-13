import { useState, useCallback } from 'react';
import { GoogleMap as GoogleMapComponent, LoadScript, Marker, InfoWindow } from '@google-maps-api/react';
import { MapPin, Navigation, Phone, Globe } from 'lucide-react';

interface GoogleMapProps {
  address: string;
  venueName: string;
  lat?: number;
  lng?: number;
}

export function GoogleMap({ address, venueName, lat = -33.4489, lng = -70.6693 }: GoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const center = { lat, lng };

  const mapOptions = {
    zoom: 15,
    center,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ]
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full h-full relative">
      {/* Fallback for when Google Maps API is not available */}
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{venueName}</h3>
          <p className="text-gray-600 mb-4">{address}</p>
          
          <div className="space-y-3">
            <button
              onClick={openDirections}
              className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Cómo llegar</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Llamar</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Globe className="w-4 h-4" />
                <span>Web</span>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Información del Venue</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Estacionamiento disponible</p>
              <p>• Acceso para personas con discapacidad</p>
              <p>• Transporte público cercano</p>
              <p>• Servicios de comida y bebida</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uncomment when Google Maps API key is available */}
      {/*
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMapComponent
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker
            position={center}
            onClick={() => setShowInfo(true)}
          />
          
          {showInfo && (
            <InfoWindow
              position={center}
              onCloseClick={() => setShowInfo(false)}
            >
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{venueName}</h3>
                <p className="text-gray-600 text-sm">{address}</p>
                <button
                  onClick={openDirections}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Cómo llegar →
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMapComponent>
      </LoadScript>
      */}
    </div>
  );
}