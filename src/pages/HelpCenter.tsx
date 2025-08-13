import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react';

const faqCategories = [
  {
    id: 'tickets',
    title: 'Compra de Tickets',
    questions: [
      {
        question: '¿Cómo puedo comprar tickets?',
        answer: 'Para comprar tickets, simplemente busca el evento que te interesa, selecciona tus asientos y procede al pago con tu cuenta de Google.'
      },
      {
        question: '¿Puedo cancelar mi compra?',
        answer: 'Las cancelaciones están sujetas a la política de cada evento. Generalmente puedes cancelar hasta 24 horas antes del evento.'
      },
      {
        question: '¿Cómo recibo mis tickets?',
        answer: 'Los tickets se envían automáticamente a tu email y también están disponibles en tu cuenta bajo "Mis Tickets".'
      }
    ]
  },
  {
    id: 'account',
    title: 'Mi Cuenta',
    questions: [
      {
        question: '¿Cómo creo una cuenta?',
        answer: 'Solo necesitas una cuenta de Google. Haz clic en "Iniciar Sesión" y autoriza el acceso con tu cuenta de Google.'
      },
      {
        question: '¿Puedo cambiar mi información personal?',
        answer: 'Sí, puedes actualizar tu información en la sección "Mi Cuenta" de tu perfil.'
      }
    ]
  },
  {
    id: 'events',
    title: 'Eventos',
    questions: [
      {
        question: '¿Cómo encuentro eventos cerca de mí?',
        answer: 'Usa nuestro buscador en la página principal o filtra por ciudad en la sección de eventos.'
      },
      {
        question: '¿Qué pasa si un evento se cancela?',
        answer: 'Si un evento se cancela, recibirás un reembolso completo automáticamente en 5-7 días hábiles.'
      }
    ]
  }
];

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('tickets');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra respuestas a las preguntas más frecuentes
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar en el centro de ayuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6 mb-12">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                {expandedCategory === category.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedCategory === category.id && (
                <div className="border-t border-gray-200">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0">
                      <button
                        onClick={() => setExpandedQuestion(
                          expandedQuestion === `${category.id}-${index}` ? null : `${category.id}-${index}`
                        )}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        {expandedQuestion === `${category.id}-${index}` ? (
                          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      {expandedQuestion === `${category.id}-${index}` && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿No encontraste lo que buscabas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Chat en Vivo</h3>
              <p className="text-gray-600 text-sm mb-4">
                Habla con nuestro equipo de soporte
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Iniciar Chat
              </button>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600 text-sm mb-4">
                Lun-Vie 9:00-18:00
              </p>
              <a
                href="tel:+56223456789"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                +56 2 2345 6789
              </a>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-4">
                Respuesta en 24 horas
              </p>
              <a
                href="mailto:support@tiketera.com"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}