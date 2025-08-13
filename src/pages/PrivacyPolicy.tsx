import { ArrowLeft, Shield, Eye, Lock, Users, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
          <p className="text-xl text-gray-600">
            Última actualización: 15 de enero de 2024
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Introducción</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              En Tiketera, valoramos y respetamos tu privacidad. Esta política explica cómo 
              recopilamos, usamos, protegemos y compartimos tu información personal cuando 
              utilizas nuestros servicios.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Información que Recopilamos</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Información Personal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Nombre completo y dirección de email (a través de Google)</li>
                  <li>• Información de contacto adicional que proporciones</li>
                  <li>• Historial de compras y preferencias de eventos</li>
                  <li>• Información de pago (procesada de forma segura por terceros)</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Información Técnica</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Dirección IP y ubicación aproximada</li>
                  <li>• Tipo de navegador y dispositivo</li>
                  <li>• Páginas visitadas y tiempo de navegación</li>
                  <li>• Cookies y tecnologías similares</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Información de Uso</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Eventos que visualizas y compras</li>
                  <li>• Interacciones con nuestro sitio web</li>
                  <li>• Comunicaciones con nuestro soporte</li>
                  <li>• Feedback y reseñas que proporciones</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Cómo Usamos tu Información</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Servicios Principales</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Procesar compras de tickets</li>
                  <li>• Gestionar tu cuenta</li>
                  <li>• Enviar confirmaciones y tickets</li>
                  <li>• Proporcionar soporte al cliente</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Mejoras y Marketing</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personalizar recomendaciones</li>
                  <li>• Enviar ofertas relevantes</li>
                  <li>• Mejorar nuestros servicios</li>
                  <li>• Análisis y estadísticas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Protección de Datos</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Medidas de Seguridad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-600">
                  <li>• Encriptación SSL/TLS</li>
                  <li>• Servidores seguros</li>
                  <li>• Acceso restringido</li>
                  <li>• Monitoreo continuo</li>
                </ul>
                <ul className="space-y-2 text-gray-600">
                  <li>• Auditorías regulares</li>
                  <li>• Backup automático</li>
                  <li>• Protección contra fraude</li>
                  <li>• Cumplimiento normativo</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sharing Information */}
          <section>
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Compartir Información</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Con Organizadores de Eventos</h3>
                <p className="text-gray-600">
                  Compartimos información básica (nombre, email) con organizadores 
                  para fines de gestión del evento y comunicación.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Con Proveedores de Servicios</h3>
                <p className="text-gray-600">
                  Trabajamos con terceros confiables para procesamiento de pagos, 
                  envío de emails y análisis, bajo estrictos acuerdos de confidencialidad.
                </p>
              </div>

              <div className="border-l-4 border-red-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Por Requerimiento Legal</h3>
                <p className="text-gray-600">
                  Solo compartimos información cuando es requerido por ley o 
                  para proteger nuestros derechos legítimos.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus Derechos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Acceso</h3>
                    <p className="text-gray-600 text-sm">Solicitar una copia de tu información personal</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Corrección</h3>
                    <p className="text-gray-600 text-sm">Actualizar información incorrecta o incompleta</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Eliminación</h3>
                    <p className="text-gray-600 text-sm">Solicitar la eliminación de tu información</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Portabilidad</h3>
                    <p className="text-gray-600 text-sm">Obtener tus datos en formato transferible</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Oposición</h3>
                    <p className="text-gray-600 text-sm">Oponerte al procesamiento de tus datos</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Restricción</h3>
                    <p className="text-gray-600 text-sm">Limitar cómo procesamos tu información</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies y Tecnologías Similares</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tipos de Cookies que Usamos</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">Esenciales:</span>
                  <span className="text-gray-600"> Necesarias para el funcionamiento del sitio</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Funcionales:</span>
                  <span className="text-gray-600"> Mejoran tu experiencia de usuario</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Analíticas:</span>
                  <span className="text-gray-600"> Nos ayudan a entender cómo usas el sitio</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Marketing:</span>
                  <span className="text-gray-600"> Para mostrarte contenido relevante</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Contacto</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Si tienes preguntas sobre esta política de privacidad o quieres ejercer 
              tus derechos, contáctanos:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> privacy@tiketera.com</p>
              <p><strong>Teléfono:</strong> +56 2 2345 6789</p>
              <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}