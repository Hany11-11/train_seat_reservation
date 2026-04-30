import { useMemo } from "react";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
import { CoachWithSeats, SeatAvailability } from "@/services/seatService";
import { HorizontalCoachView } from "@/components/organisms/HorizontalCoachView";
import { Armchair, CheckCircle2, XCircle, Ban } from "lucide-react";

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
    return coaches.find((c) => c.coachId === activeCoachId) || null;
  }, [activeCoachId, coaches]);

  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case "1ST":
        return "class1st";
      case "2ND":
        return "class2nd";
      case "3RD":
        return "class3rd";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-zinc-200/40 border border-zinc-100/80 p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header and Coach Selector */}
      <div className="space-y-4 flex flex-col">
        <div className="flex items-center justify-between px-1 border-b pb-3">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
            Select Your Coach
          </h3>
          {activeCoach && (
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-100/50 text-blue-700 px-3 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <Armchair className="w-4 h-4" />
              <span className="text-sm font-bold tracking-tight">{activeCoach.availableSeats} Seats Available</span>
            </div>
          )}
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-1 pt-1">
          {coaches.map((coach) => {
            const isActive = activeCoach?.coachId === coach.coachId;
            const utilization = (coach.totalSeats - coach.availableSeats) / coach.totalSeats;
            const isAlmostFull = utilization > 0.8 && coach.availableSeats > 0;

            return (
              <button
                key={coach.coachId}
                onClick={() => onCoachSelect(coach.coachId)}
                className={cn(
                  "relative flex flex-row items-center gap-3 min-w-max p-2 sm:p-2.5 pr-4 sm:pr-5 rounded-xl border transition-all duration-200 ease-out text-left flex-shrink-0 group",
                  isActive
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm transform scale-[1.02]"
                    : "border-zinc-200 shadow-sm bg-white hover:border-blue-400 hover:bg-blue-50/50 hover:shadow"
                )}
              >
                {/* Compact icon badge for Class Type */}
                <div className={cn(
                  "w-9 sm:w-11 h-9 sm:h-11 rounded-lg flex flex-col items-center justify-center shadow-inner transition-colors",
                  isActive ? "bg-blue-600 text-white shadow-blue-500/40" : "bg-zinc-100 text-zinc-600 border border-zinc-200 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:border-blue-200"
                )}>
                  <span className="text-[9px] sm:text-[10px] font-black tracking-wider">{coach.classType}</span>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-bold text-sm sm:text-base tracking-tight",
                      isActive ? "text-blue-900" : "text-zinc-800 group-hover:text-blue-900"
                    )}>{coach.coachName}</span>
                    
                    {isAlmostFull && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Filling Fast" />
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={cn("text-xs sm:text-sm font-black leading-none", isActive ? "text-blue-700" : "text-emerald-600")}>
                      {coach.availableSeats}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Avail</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Seat Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/60 shadow-inner">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-6 h-6 rounded-md border-2 border-emerald-400 bg-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="text-xs font-semibold text-zinc-700">Available</span>
        </div>
        
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-6 h-6 rounded-md bg-blue-600 shadow-sm shadow-blue-500/30 flex items-center justify-center transition-transform group-hover:scale-110">
             <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-zinc-700">Selected</span>
        </div>
        
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-6 h-6 rounded-md bg-red-50 border-2 border-red-200 flex items-center justify-center transition-transform group-hover:scale-110">
             <XCircle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <span className="text-xs font-semibold text-zinc-700">Booked</span>
        </div>
        
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-6 h-6 rounded-md bg-gray-100 border-2 border-gray-200 opacity-70 flex items-center justify-center transition-transform group-hover:scale-110">
             <Ban className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="text-xs font-semibold text-zinc-700">Unavailable</span>
        </div>
      </div>

      {/* Horizontal coach view */}
      <div className="pt-2">
        {activeCoach && (
          <HorizontalCoachView
            coach={activeCoach}
            selectedSeatIds={selectedSeatIds}
            onSeatClick={onSeatClick}
          />
        )}
      </div>
    </div>
  );
};
