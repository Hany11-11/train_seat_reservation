import { Seat } from '@/components/atoms/Seat';
import { Seat as SeatType } from '@/types/seat';
import { cn } from '@/lib/utils';

interface SeatRowProps {
  seats: SeatType[];
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatType) => void;
  layout: string;
  rowNumber: number;
}

export const SeatRow = ({ seats, selectedSeatIds, onSeatClick, layout, rowNumber }: SeatRowProps) => {
  const [leftCount, rightCount] = layout.split('-').map(Number);
  const leftSeats = seats.slice(0, leftCount);
  const rightSeats = seats.slice(leftCount, leftCount + rightCount);

  return (
    <div className="flex items-center gap-4 py-1">
      {/* Row number */}
      <span className="w-6 text-xs text-muted-foreground font-medium">{rowNumber}</span>
      
      {/* Left side seats */}
      <div className="flex gap-1.5">
        {leftSeats.map(seat => (
          <Seat
            key={seat.id}
            seatNumber={seat.seatNumber}
            status={seat.status}
            isSelected={selectedSeatIds.includes(seat.id)}
            onClick={() => onSeatClick(seat)}
          />
        ))}
      </div>

      {/* Aisle */}
      <div className="w-6 flex items-center justify-center">
        <div className="w-px h-6 bg-border" />
      </div>

      {/* Right side seats */}
      <div className="flex gap-1.5">
        {rightSeats.map(seat => (
          <Seat
            key={seat.id}
            seatNumber={seat.seatNumber}
            status={seat.status}
            isSelected={selectedSeatIds.includes(seat.id)}
            onClick={() => onSeatClick(seat)}
          />
        ))}
      </div>
    </div>
  );
};
