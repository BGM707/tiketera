import { ArrowLeft, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RefundPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Reembolsos</h1>
          <p className="text-xl text-gray-600">
            Última actualización: 15 de enero de 2024
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumen General</h2>
            <p className="text-gray-600 leading-relaxed">
              En Tiketera, entendemos que a veces los planes cambian. Esta política explica 
              cuándo y cómo puedes solicitar un reembolso por tus compras de tickets.
            </p>
          </section>

          {/* Refund Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Condiciones para Reembolsos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Reembolso Completo</h3>
                </div>
                <ul className="space-y-2 text-green-800">
                  <li>• Cancelación del evento por el organizador</li>
                  <li>• Cambio significativo de fecha/hora</li>
                  <li>• Cambio de venue sin alternativa</li>
                  <li>• Error en la compra (duplicación)</li>
                </ul>
              </div>

              <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                <div className="flex items-center mb-4">
                  <XCircle className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="font-semibold text-red-900">Sin Reembolso</h3>
                </div>
                <ul className="space-y-2 text-red-800">
                  <li>• Cambio de opinión personal</li>
                  <li>• No poder asistir por motivos personales</li>
                  <li>• Pérdida o robo de tickets</li>
                  <li>• Eventos realizados según lo programado</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Timeframes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plazos para Solicitar Reembolsos</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Cancelación Voluntaria</h3>
                  <p className="text-gray-600">
                    Hasta 48 horas antes del evento: Reembolso del 80% del valor del ticket
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Cancelación de Último Momento</h3>
                  <p className="text-gray-600">
                    Entre 24-48 horas antes: Reembolso del 50% del valor del ticket
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <Clock className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Menos de 24 horas</h3>
                  <p className="text-gray-600">
                    No se procesan reembolsos por cancelaciones voluntarias
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proceso de Reembolso</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Solicitud</h3>
                  <p className="text-gray-600">
                    Envía tu solicitud de reembolso a través de tu cuenta en "Mis Compras" 
                    o contacta nuestro soporte.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Revisión</h3>
                  <p className="text-gray-600">
                    Nuestro equipo revisará tu solicitud en un plazo máximo de 2 días hábiles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Procesamiento</h3>
                  <p className="text-gray-600">
                    Si es aprobada, el reembolso se procesará en 5-7 días hábiles al método 
                    de pago original.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Métodos de Reembolso</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Información Importante</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Los reembolsos se procesan al método de pago original</li>
                <li>• Tarjetas de crédito: 5-7 días hábiles</li>
                <li>• Transferencias bancarias: 3-5 días hábiles</li>
                <li>• Los cargos por servicio no son reembolsables en cancelaciones voluntarias</li>
              </ul>
            </div>
          </section>

          {/* Special Cases */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Casos Especiales</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Eventos Pospuestos</h3>
                <p className="text-gray-600">
                  Si un evento se pospone, tu ticket sigue siendo válido para la nueva fecha. 
                  Si no puedes asistir, puedes solicitar reembolso completo.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Cambio de Artista Principal</h3>
                <p className="text-gray-600">
                  Si el artista principal cambia, tienes derecho a reembolso completo 
                  si solicitas dentro de 7 días del anuncio.
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Problemas de Salud</h3>
                <p className="text-gray-600">
                  En casos de emergencia médica documentada, evaluamos reembolsos 
                  caso por caso, incluso fuera de los plazos normales.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">¿Necesitas ayuda?</h2>
            <p className="text-gray-600 mb-4">
              Si tienes preguntas sobre nuestra política de reembolsos o necesitas 
              solicitar un reembolso, contáctanos:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Contactar Soporte
              </Link>
              <Link
                to="/help"
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Centro de Ayuda
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}