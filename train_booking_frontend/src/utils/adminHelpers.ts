import { Booking } from '@/types/booking';
import { Train } from '@/types/train';
import { Schedule } from '@/types/schedule';
import { Coach } from '@/types/seat';

export const getBookingStats = (bookings: Booking[]): {
  total: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  revenue: number;
} => {
  return {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    revenue: bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };
};

export const getTrainStats = (trains: Train[]): {
  total: number;
  active: number;
  inactive: number;
} => {
  return {
    total: trains.length,
    active: trains.filter(t => t.isActive).length,
    inactive: trains.filter(t => !t.isActive).length,
  };
};

export const getScheduleStats = (schedules: Schedule[]): {
  total: number;
  active: number;
  inactive: number;
} => {
  return {
    total: schedules.length,
    active: schedules.filter(s => s.status === 'ACTIVE').length,
    inactive: schedules.filter(s => s.status === 'INACTIVE').length,
  };
};

export const getSeatStats = (coaches: Coach[]): {
  totalCoaches: number;
  totalSeats: number;
  firstClass: number;
  secondClass: number;
  thirdClass: number;
} => {
  return {
    totalCoaches: coaches.length,
    totalSeats: coaches.reduce((sum, c) => sum + c.totalSeats, 0),
    firstClass: coaches.filter(c => c.classType === '1ST').reduce((sum, c) => sum + c.totalSeats, 0),
    secondClass: coaches.filter(c => c.classType === '2ND').reduce((sum, c) => sum + c.totalSeats, 0),
    thirdClass: coaches.filter(c => c.classType === '3RD').reduce((sum, c) => sum + c.totalSeats, 0),
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
