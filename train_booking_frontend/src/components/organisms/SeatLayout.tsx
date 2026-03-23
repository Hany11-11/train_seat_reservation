import { useMemo } from 'react';
import { SeatRow } from '@/components/molecules/SeatRow';
import { Badge } from '@/components/atoms/Badge';
import { Seat } from '@/components/atoms/Seat';
import { cn } from '@/lib/utils';
import { CoachWithSeats, SeatAvailability } from '@/services/seatService';

interface SeatLayoutProps {
  coaches: CoachWithSeats[];
  activeCoachId: string | null;
  selectedSeatIds: string[];
  onCoachSelect: (coachId: string) => void;
  onSeatClick: (seat: SeatAvailability) => void;
}

export const SeatLayout = ({
  coaches,
  activeCoachId,
  selectedSeatIds,
  onCoachSelect,
  onSeatClick,
}: SeatLayoutProps) => {
  const activeCoach = useMemo(() => {
    if (!activeCoachId && coaches.length > 0) {
      return coaches[0];
    }
    return coaches.find(c => c.coachId === activeCoachId) || null;
  }, [activeCoachId, coaches]);

  const seatsByRow = useMemo(() => {
    if (!activeCoach) return {};
    return activeCoach.seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<number, SeatAvailability[]>);
  }, [activeCoach]);

  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case '1ST': return 'class1st';
      case '2ND': return 'class2nd';
      case '3RD': return 'class3rd';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Coach selector */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Coach</h3>
        <div className="flex flex-wrap gap-2">
          {coaches.map(coach => {
            const isActive = activeCoach?.coachId === coach.coachId;
            
            return (
              <button
                key={coach.coachId}
                onClick={() => onCoachSelect(coach.coachId)}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 transition-all',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{coach.coachName}</span>
                  <Badge variant={getClassBadgeVariant(coach.classType)} size="sm">
                    {coach.classType}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {coach.availableSeats} / {coach.totalSeats} available
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seat legend */}
      <div className="flex flex-wrap gap-6 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Seat seatNumber="" status="available" size="sm" disabled />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Seat seatNumber="" status="selected" isSelected size="sm" disabled />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <Seat seatNumber="" status="booked" size="sm" disabled />
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <Seat seatNumber="" status="unavailable" size="sm" disabled />
          <span className="text-sm text-muted-foreground">Unavailable</span>
        </div>
      </div>

      {/* Seat grid */}
      {activeCoach && (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-max">
            {/* Train front indicator */}
            <div className="flex items-center justify-center mb-4">
              <div className="px-4 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                ← Front
              </div>
            </div>

            {/* Seat rows */}
            <div className="space-y-1">
              {Object.entries(seatsByRow)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([rowNum]) => (
                  <SeatRow
                    key={rowNum}
                    seats={seatsByRow[rowNum]}
                    selectedSeatIds={selectedSeatIds}
                    onSeatClick={onSeatClick}
                    layout={activeCoach.layout}
                    rowNumber={parseInt(rowNum)}
                  />
                ))}
            </div>

            {/* Train back indicator */}
            <div className="flex items-center justify-center mt-4">
              <div className="px-4 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                Back →
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
