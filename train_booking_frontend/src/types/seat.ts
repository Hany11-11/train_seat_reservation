export type SeatStatus = 'available' | 'selected' | 'booked' | 'unavailable';

export interface Seat {
  id: string;
  coachId: string;
  seatNumber: string;
  row: number;
  column: string;
  status: SeatStatus;
  classType: '1ST' | '2ND' | '3RD';
}

export interface Coach {
  id: string;
  trainId: string;
  name: string;
  classType: '1ST' | '2ND' | '3RD';
  totalSeats: number;
  seatsPerRow: number;
  totalRows: number;
  layout: string;
}

export interface SeatLayout {
  scheduleId: string;
  date: string;
  coaches: CoachWithSeats[];
}

export interface CoachWithSeats extends Coach {
  seats: Seat[];
}
