import { useMemo } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Seat } from '@/components/atoms/Seat';
import { cn } from '@/lib/utils';
import { CoachWithSeats, SeatAvailability } from '@/services/seatService';
import { HorizontalCoachView } from '@/components/organisms/HorizontalCoachView';

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
    if (!activeCoachId && coaches.length > 0) return coaches[0];
    return coaches.find(c => c.coachId === activeCoachId) || null;
  }, [activeCoachId, coaches]);

  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case '1ST': return 'class1st';
      case '2ND': return 'class2nd';
      case '3RD': return 'class3rd';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">

      {/* ── Coach selector tabs ─────────────────────────────── */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Coach</h3>
        <div className="flex flex-wrap gap-2">
          {coaches.map(coach => {
            const isActive = activeCoach?.coachId === coach.coachId;
            return (
              <button
                key={coach.coachId}
                onClick={() => onCoachSelect(coach.coachId)}
                className={cn(
                  'px-4 py-2 rounded-lg border-2 transition-all text-left',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{coach.coachName}</span>
                  <Badge variant={getClassBadgeVariant(coach.classType) as any} size="sm">
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

      {/* ── Seat legend ─────────────────────────────────────── */}
      <div className="flex flex-wrap gap-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="slr-seat slr-seat--available !w-6 !h-6 !cursor-default !shadow-none hover:transform-none" />
          <span className="text-sm font-medium text-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="slr-seat slr-seat--selected !w-6 !h-6 !cursor-default !shadow-none !animate-none" />
          <span className="text-sm font-medium text-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="slr-seat slr-seat--booked !w-6 !h-6 !cursor-default" />
          <span className="text-sm font-medium text-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="slr-seat slr-seat--unavailable !w-6 !h-6 !cursor-default" />
          <span className="text-sm font-medium text-foreground">Unavailable</span>
        </div>
      </div>

      {/* ── Horizontal coach view ────────────────────────────── */}
      {activeCoach && (
        <HorizontalCoachView
          coach={activeCoach}
          selectedSeatIds={selectedSeatIds}
          onSeatClick={onSeatClick}
        />
      )}
    </div>
  );
};
