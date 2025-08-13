const LOCAL_API = 'http://localhost:8888/.netlify/functions';
const PROD_API = '/.netlify/functions';

// Si tienes dominio fijo en producción, puedes reemplazar esta URL:
const PROD_FULL_URL = 'https://tu-dominio.netlify.app/.netlify/functions';

const API_BASE = import.meta.env.DEV ? LOCAL_API : PROD_API;

export class ApiService {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (err) {
      // Fallback: si está en local y falla, probar con la URL de producción
      if (import.meta.env.DEV) {
        console.warn(`Fallo conexión local, intentando producción... (${url})`);
        const fallbackResponse = await fetch(`${PROD_FULL_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!fallbackResponse.ok) {
          const error = await fallbackResponse.json().catch(() => ({ error: 'Network error' }));
          throw new Error(error.error || `Fallback request failed: ${fallbackResponse.status}`);
        }

        return fallbackResponse.json();
      }

      throw err;
    }
  }

  // Events
  static async getEvents() {
    return this.request('/get-events');
  }

  static async getEvent(id: string) {
    return this.request(`/get-event?id=${encodeURIComponent(id)}`);
  }

  static async createEvent(eventData: any, token: string) {
    return this.request('/create-event', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
  }

  static async updateEvent(id: string, eventData: any, token: string) {
    return this.request(`/update-event?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
  }

  static async deleteEvent(id: string, token: string) {
    return this.request(`/delete-event?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Venues
  static async getVenues() {
    return this.request('/get-venues');
  }

  static async createVenue(venueData: any, token: string) {
    return this.request('/create-venue', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(venueData),
    });
  }

  // Dashboard
  static async getDashboardStats(token: string) {
    return this.request('/get-dashboard-stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Authentication
  static async authCallback(token: string) {
    return this.request('/auth-callback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  static async resetPassword(email: string) {
    return this.request('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async verifyEmail(token: string) {
    return this.request('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async resendVerification(email: string) {
    return this.request('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // QR Scanner
  static async verifyQR(qrCode: string, token: string) {
    return this.request('/verify-qr', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ qr_code: qrCode }),
    });
  }

  // Orders and Reservations
  static async reserveSeats(reservationData: any, token: string) {
    return this.request('/reserve-seat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });
  }

  static async getOrders(token: string) {
    return this.request('/get-orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}
