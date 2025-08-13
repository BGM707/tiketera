import { Link } from 'react-router-dom';
import { Ticket, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
              <Ticket className="w-8 h-8" />
              <span>Tiketera</span>
            </Link>
            <p className="text-gray-400 text-sm">
              La plataforma líder en venta de tickets para eventos en Chile. 
              Encuentra y compra entradas para los mejores espectáculos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link to="/events" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Todos los Eventos
              </Link>
              <Link to="/categories" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Categorías
              </Link>
              <Link to="/venues" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Venues
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Sobre Nosotros
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Soporte</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Centro de Ayuda
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contacto
              </Link>
              <Link to="/refunds" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Política de Reembolsos
              </Link>
              <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Términos y Condiciones
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+56 2 2345 6789</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>supporttiketera@tiketera.com</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Av. Providencia 1234, Oficina 567<br />Santiago, Chile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Tiketera. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Métodos de pago:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-green-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  WP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}