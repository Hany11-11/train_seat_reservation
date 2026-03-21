import { BookedSeat } from '@/types/booking';
import { Price } from '@/types/price';

export const calculateTotalFare = (seats: BookedSeat[]): number => {
  return seats.reduce((total, seat) => total + seat.price, 0);
};

export const getPriceForClass = (prices: Price[], classType: '1ST' | '2ND' | '3RD'): number => {
  const price = prices.find(p => p.classType === classType);
  return price?.basePrice ?? 0;
};

export const formatCurrency = (amount: number, currency: string = 'LKR'): string => {
  return `${currency} ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-LK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
