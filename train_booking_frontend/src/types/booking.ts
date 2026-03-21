export interface Booking {
  id: string;
  referenceNumber: string;
  userId: string;
  scheduleId: string;
  trainId: string;
  travelDate: string;
  seats: BookedSeat[];
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  passengerDetails: PassengerDetails;
}

export interface BookedSeat {
  seatId: string;
  coachId: string;
  seatNumber: string;
  coachName: string;
  classType: '1ST' | '2ND' | '3RD';
  price: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface PassengerDetails {
  name: string;
  nic: string;
  email: string;
  mobile: string;
}

export interface BookingSearchResult {
  scheduleId: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  availability: ClassAvailability[];
}

export interface ClassAvailability {
  classType: '1ST' | '2ND' | '3RD';
  className: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}
