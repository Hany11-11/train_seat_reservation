import { Booking } from '@/types/booking';

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    referenceNumber: 'TRN-2024-001234',
    userId: 'u1',
    scheduleId: 's1',
    trainId: 't1',
    travelDate: '2024-02-15',
    seats: [
      { seatId: 'c1-1_1_1', coachId: 'c1-1', seatNumber: '1', coachName: 'A1', classType: '1ST', price: 1500 },
      { seatId: 'c1-1_1_2', coachId: 'c1-1', seatNumber: '2', coachName: 'A1', classType: '1ST', price: 1500 },
    ],
    totalAmount: 3000,
    status: 'confirmed',
    createdAt: '2024-02-10T10:30:00Z',
    passengerDetails: {
      name: 'John Perera',
      nic: '199012345678',
      email: 'john@example.com',
      mobile: '0771234567',
    },
  },
  {
    id: 'b2',
    referenceNumber: 'TRN-2024-001235',
    userId: 'u2',
    scheduleId: 's2',
    trainId: 't2',
    travelDate: '2024-02-18',
    seats: [
      { seatId: 'c2-2_3_1', coachId: 'c2-2', seatNumber: '9', coachName: 'B1', classType: '2ND', price: 450 },
    ],
    totalAmount: 450,
    status: 'confirmed',
    createdAt: '2024-02-12T14:20:00Z',
    passengerDetails: {
      name: 'Sarah Fernando',
      nic: '198523456789',
      email: 'sarah@example.com',
      mobile: '0772345678',
    },
  },
];

export const getBookingsFromStorage = (): Booking[] => {
  const stored = localStorage.getItem('bookings');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('bookings', JSON.stringify(mockBookings));
  return mockBookings;
};

export const saveBookingsToStorage = (bookings: Booking[]): void => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

export const getBookingsForUser = (userId: string): Booking[] => {
  const bookings = getBookingsFromStorage();
  return bookings.filter(b => b.userId === userId);
};

export const generateBookingReference = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `TRN-${year}-${random}`;
};
