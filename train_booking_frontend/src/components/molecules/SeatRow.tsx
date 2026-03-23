import { Seat } from '@/components/atoms/Seat';
import { SeatAvailability } from '@/services/seatService';

interface SeatRowProps {
  seats: SeatAvailability[];
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatAvailability) => void;
  layout: string;
  rowNumber: number;
}

export const SeatRow = ({ seats, selectedSeatIds, onSeatClick, layout, rowNumber }: SeatRowProps) => {
  const [leftCount, rightCount] = layout.split('-').map(Number);
  
  // Sort by column letter (A, B, C, D) - column is a string like "A", "B"
  const sortedSeats = [...seats].sort((a, b) => {
    return a.column.localeCompare(b.column);
  });
  
  const leftSeats = sortedSeats.slice(0, leftCount);
  const rightSeats = sortedSeats.slice(leftCount, leftCount + rightCount);

  return (
    <div className="flex items-center gap-4 py-1">
      {/* Row number */}
      <span className="w-6 text-xs text-muted-foreground font-medium">{rowNumber}</span>
      
      {/* Left side seats */}
      <div className="flex gap-1.5">
        {leftSeats.map(seat => (
          <Seat
            key={seat._id}
            seatNumber={seat.seatNumber}
            status={seat.status}
            isSelected={selectedSeatIds.includes(seat._id)}
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
            key={seat._id}
            seatNumber={seat.seatNumber}
            status={seat.status}
            isSelected={selectedSeatIds.includes(seat._id)}
            onClick={() => onSeatClick(seat)}
          />
        ))}
      </div>
    </div>
  );
};
