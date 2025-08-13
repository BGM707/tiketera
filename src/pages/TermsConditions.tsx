import { ArrowLeft, FileText, Scale, AlertTriangle, Users, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsConditions() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
          <p className="text-xl text-gray-600">
            Última actualización: 15 de enero de 2024
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Introducción</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bienvenido a Tiketera. Estos términos y condiciones rigen el uso de nuestro 
              sitio web y servicios. Al acceder y usar nuestros servicios, aceptas cumplir 
              con estos términos.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Aceptación de Términos</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800">
                Al crear una cuenta, comprar tickets o usar cualquier parte de nuestros 
                servicios, confirmas que has leído, entendido y aceptado estos términos 
                y condiciones, así como nuestra política de privacidad.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Cuentas de Usuario</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Registro y Autenticación</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Debes usar una cuenta de Google válida para registrarte</li>
                  <li>• Eres responsable de mantener la seguridad de tu cuenta</li>
                  <li>• Debes proporcionar información precisa y actualizada</li>
                  <li>• No puedes compartir tu cuenta con terceros</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Responsabilidades del Usuario</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Usar los servicios de manera legal y apropiada</li>
                  <li>• No intentar acceder a cuentas de otros usuarios</li>
                  <li>• Reportar cualquier uso no autorizado de tu cuenta</li>
                  <li>• Cumplir con todas las leyes aplicables</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Ticket Purchases */}
          <section>
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Compra de Tickets</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Proceso de Compra</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Los precios incluyen todos los impuestos aplicables</li>
                    <li>• Los cargos por servicio se muestran antes del pago</li>
                    <li>• La compra se confirma al completar el pago</li>
                    <li>• Recibirás confirmación por email</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Limitaciones</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Máximo 8 tickets por transacción</li>
                    <li>• Los tickets son nominativos</li>
                    <li>• Prohibida la reventa comercial</li>
                    <li>• Sujeto a disponibilidad</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Importante</h3>
                    <p className="text-yellow-800">
                      Los tickets son válidos solo para el evento, fecha y asiento especificados. 
                      No son transferibles sin autorización previa. La reventa no autorizada 
                      puede resultar en la cancelación del ticket sin reembolso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Event Policies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Políticas de Eventos</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Entrada a Eventos</h3>
                <p className="text-gray-600">
                  Debes presentar tu ticket (digital o impreso) y una identificación válida 
                  para ingresar al evento. El organizador se reserva el derecho de admisión.
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Cambios en Eventos</h3>
                <p className="text-gray-600">
                  Los organizadores pueden cambiar fechas, horarios, artistas o venues. 
                  Te notificaremos de cualquier cambio significativo por email.
                </p>
              </div>

              <div className="border-l-4 border-red-400 pl-4 py-2">
                <h3 className="font-semibold text-gray-900">Cancelaciones</h3>
                <p className="text-gray-600">
                  Si un evento se cancela, recibirás un reembolso completo automáticamente. 
                  No somos responsables por gastos adicionales como viajes o alojamiento.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section>
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Usos Prohibidos</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-4">No está permitido:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-red-800">
                  <li>• Usar bots o scripts automatizados</li>
                  <li>• Revender tickets sin autorización</li>
                  <li>• Crear múltiples cuentas</li>
                  <li>• Interferir con el funcionamiento del sitio</li>
                </ul>
                <ul className="space-y-2 text-red-800">
                  <li>• Usar información falsa</li>
                  <li>• Violar derechos de propiedad intelectual</li>
                  <li>• Realizar actividades fraudulentas</li>
                  <li>• Acosar a otros usuarios</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitación de Responsabilidad</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Servicios "Como Están"</h3>
                <p className="text-gray-600">
                  Proporcionamos nuestros servicios "como están" sin garantías de ningún tipo. 
                  No garantizamos que el servicio sea ininterrumpido o libre de errores.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Limitaciones</h3>
                <p className="text-gray-600">
                  Nuestra responsabilidad se limita al valor de los tickets comprados. 
                  No somos responsables por daños indirectos, incidentales o consecuenciales.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Propiedad Intelectual</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                Todo el contenido del sitio web, incluyendo textos, gráficos, logos, 
                imágenes y software, es propiedad de Tiketera o sus licenciantes y 
                está protegido por las leyes de propiedad intelectual.
              </p>
              <p className="text-gray-600">
                Puedes usar nuestro sitio para fines personales y no comerciales. 
                Cualquier otro uso requiere autorización previa por escrito.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Modificaciones</h2>
            
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
              <p className="text-blue-800">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación. 
                Te notificaremos de cambios significativos por email.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ley Aplicable</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Estos términos se rigen por las leyes de Chile. Cualquier disputa 
                será resuelta en los tribunales competentes de Santiago, Chile.
              </p>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Resolución de Disputas</h3>
                <p className="text-gray-600">
                  Antes de iniciar cualquier acción legal, las partes intentarán 
                  resolver las disputas mediante negociación de buena fe durante 
                  un período de 30 días.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contacto</h2>
            <p className="text-gray-600 mb-4">
              Si tienes preguntas sobre estos términos y condiciones, contáctanos:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> legal@tiketera.com</p>
              <p><strong>Teléfono:</strong> +56 2 2345 6789</p>
              <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}