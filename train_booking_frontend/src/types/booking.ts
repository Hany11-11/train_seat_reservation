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
  fromStation: {
    id: string;
    name: string;
    code: string;
  };
  toStation: {
    id: string;
    name: string;
    code: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  passengers?: number;
  fromStationRoute?: {
    id: string;
    name: string;
    arrivalTime: string;
    departureTime: string;
  };
  toStationRoute?: {
    id: string;
    name: string;
    arrivalTime: string;
    departureTime: string;
  };
  userDuration?: string;
  availability: {
    [classType: string]: {
      totalSeats: number;
      availableSeats: number;
      coaches: Array<{
        coachName: string;
        totalSeats: number;
        layout?: string;
        rows: number;
        seatsPerRow: number;
      }>;
    };
  };
  prices?: {
    '1ST'?: number;
    '2ND'?: number;
    '3RD'?: number;
  };
  classTypes?: string[];
  route?: Array<{
    stationId: string;
    stationName: string;
    stationCode: string;
    arrivalTime: string;
    departureTime: string;
  }>;
}

export interface ClassAvailability {
  classType: '1ST' | '2ND' | '3RD';
  className: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}
