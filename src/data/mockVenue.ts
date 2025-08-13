import { Section, Seat } from '../types';

// Generar asientos para una sección
const generateSeats = (sectionId: string, rows: number, seatsPerRow: number): Seat[] => {
  const seats: Seat[] = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let r = 0; r < rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({
        id: `${sectionId}-${letters[r]}${s}`,
        row: letters[r],
        number: s,
        status: Math.random() > 0.3 ? 'available' : Math.random() > 0.5 ? 'sold' : 'reserved',
        x: s * 25 + (r % 2) * 12, // Alternating offset for better view
        y: r * 20,
      });
    }
  }
  return seats;
};

export const mockSections: Section[] = [
  {
    id: 'vip',
    name: 'VIP',
    type: 'vip',
    price: 150000,
    color: '#FFD700',
    x: 200,
    y: 100,
    width: 300,
    height: 120,
    seats: generateSeats('vip', 6, 12),
  },
  {
    id: 'premium',
    name: 'Premium',
    type: 'premium',
    price: 80000,
    color: '#FF6B35',
    x: 50,
    y: 250,
    width: 600,
    height: 140,
    seats: generateSeats('premium', 7, 24),
  },
  {
    id: 'general-1',
    name: 'Platea General A',
    type: 'general',
    price: 45000,
    color: '#4ECDC4',
    x: 50,
    y: 420,
    width: 600,
    height: 160,
    seats: generateSeats('general-1', 8, 24),
  },
  {
    id: 'general-2',
    name: 'Platea General B',
    type: 'general',
    price: 35000,
    color: '#45B7D1',
    x: 50,
    y: 600,
    width: 600,
    height: 160,
    seats: generateSeats('general-2', 8, 24),
  },
  {
    id: 'box-left',
    name: 'Palco Izquierdo',
    type: 'box',
    price: 120000,
    color: '#96CEB4',
    x: 20,
    y: 150,
    width: 80,
    height: 80,
    seats: generateSeats('box-left', 2, 4),
  },
  {
    id: 'box-right',
    name: 'Palco Derecho',
    type: 'box',
    price: 120000,
    color: '#96CEB4',
    x: 600,
    y: 150,
    width: 80,
    height: 80,
    seats: generateSeats('box-right', 2, 4),
  },
];