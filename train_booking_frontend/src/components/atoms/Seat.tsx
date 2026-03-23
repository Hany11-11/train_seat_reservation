import { SeatStatus } from '@/types/seat';
import { cn } from '@/lib/utils';

interface SeatProps {
  seatNumber: string;
  status: SeatStatus;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Seat = ({ 
  seatNumber, 
  status, 
  isSelected = false, 
  onClick, 
  disabled = false,
  size = 'md'
}: SeatProps) => {
  const isClickable = status === 'available' && !disabled;
  const showAsSelected = isSelected || status === 'selected';

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        'rounded-md font-medium transition-all duration-200 flex items-center justify-center border-2',
        sizeClasses[size],
        // Available state
        status === 'available' && !showAsSelected && [
          'bg-seat-available/20 border-seat-available text-seat-available',
          'hover:bg-seat-available hover:text-white hover:scale-105',
          'cursor-pointer',
        ],
        // Selected state
        showAsSelected && [
          'bg-seat-selected border-seat-selected text-white',
          'animate-seat-select cursor-pointer',
          'shadow-md',
        ],
        // Booked state
        status === 'booked' && [
          'bg-seat-booked/30 border-seat-booked/50 text-seat-booked',
          'cursor-not-allowed',
        ],
        // Unavailable state
        status === 'unavailable' && [
          'bg-seat-unavailable border-seat-unavailable/50 text-muted-foreground',
          'cursor-not-allowed opacity-50',
        ]
      )}
      aria-label={`Seat ${seatNumber} - ${status}`}
    >
      {seatNumber}
    </button>
  );
};
