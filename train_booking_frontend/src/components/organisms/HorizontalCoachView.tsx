import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { CoachWithSeats, SeatAvailability } from "@/services/seatService";

interface HorizontalCoachViewProps {
  coach: CoachWithSeats;
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatAvailability) => void;
}

interface SeatCellProps {
  seat: SeatAvailability | null;
  displayNumber: number;
  isWindow: boolean;
  isAisle: boolean;
  isSelected: boolean;
  onSeatClick: (seat: SeatAvailability) => void;
}

const SeatCell = ({
  seat,
  displayNumber,
  isWindow,
  isAisle,
  isSelected,
  onSeatClick,
}: SeatCellProps) => {
  if (!seat) {
    return <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />;
  }
  const status = seat.status;
  const clickable = status === "available";

  return (
    <button
      type="button"
      onClick={clickable ? () => onSeatClick(seat) : undefined}
      disabled={!clickable}
      aria-label={`Seat ${displayNumber}`}
      className={cn(
        "relative group flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 ease-out border-2 shadow-sm flex-shrink-0 overflow-hidden",
        status === "available" &&
          !isSelected &&
          "bg-white border-emerald-400 hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-md hover:-translate-y-[2px] hover:scale-105 active:scale-95 cursor-pointer",
        isSelected &&
          "bg-blue-600 border-blue-700 shadow-blue-500/40 shadow-md text-white scale-110 active:scale-95 z-10",
        status === "booked" &&
          "bg-red-50 border-red-200 cursor-not-allowed",
        status === "unavailable" &&
          "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed",
      )}
    >
      {/* Seat Number */}
      <span
        className={cn(
          "text-xs sm:text-sm font-bold z-10 transition-colors pointer-events-none",
          status === "available" && !isSelected && "text-emerald-700",
          isSelected && "text-white drop-shadow-sm",
          status === "booked" && "text-red-400 opacity-80",
          status === "unavailable" && "text-gray-400",
        )}
      >
        {displayNumber}
      </span>

      {/* Badges (W / A) */}
      {(isWindow || isAisle) && (
        <span
          className={cn(
            "absolute top-[2px] right-[2px] text-[7px] sm:text-[9px] font-black leading-none pointer-events-none",
            isWindow && status === "available" && !isSelected
              ? "text-amber-500"
              : "",
            isAisle && status === "available" && !isSelected
              ? "text-purple-500"
              : "",
            isSelected ? "text-blue-200" : "",
            status === "booked" ? "text-red-300" : "",
            status === "unavailable" ? "text-slate-400" : "",
          )}
        >
          {isWindow ? "W" : "A"}
        </span>
      )}
    </button>
  );
};

export const HorizontalCoachView = ({
  coach,
  selectedSeatIds,
  onSeatClick,
}: HorizontalCoachViewProps) => {
  // Group seats by row, sorted ascending
  const rows = useMemo(() => {
    const map: Record<number, SeatAvailability[]> = {};
    for (const seat of coach.seats) {
      if (!map[seat.row]) map[seat.row] = [];
      map[seat.row].push(seat);
    }
    return Object.entries(map)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([, seats]) =>
        seats.sort((a, b) => a.column.localeCompare(b.column)),
      );
  }, [coach.seats]);

  return (
    <div className="w-full flex flex-col items-center py-4">
      {/* Travel Direction Animation */}
      <div className="w-full flex justify-center mb-8 relative z-10 text-center">
        <div className="flex items-center">
          {/* Animated Chevrons pointing Left */}
          <div className="flex -space-x-2 mr-3 opacity-90">
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6 text-blue-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400 animate-pulse"
              style={{ animationDelay: "150ms" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6 text-blue-300 animate-pulse"
              style={{ animationDelay: "300ms" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          <span className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-zinc-400 uppercase">
            Seat Direction
          </span>
        </div>
      </div>

      {/* Fixed-Place Horizontal Train Wrapper (Flex-Wrap) */}
      <div className="w-full bg-gradient-to-b from-zinc-50 to-zinc-100 rounded-[2.5rem] p-4 sm:p-8 shadow-xl shadow-zinc-200/50 border-[6px] border-zinc-200/80 ring-4 sm:ring-8 ring-zinc-50 relative overflow-hidden flex flex-col items-center">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Seat grid (Horizontally laid out, but wraps on narrow screens) */}
        <div className="flex flex-row flex-wrap justify-center w-full relative z-10 gap-x-2 gap-y-8 sm:gap-x-4 sm:gap-y-12">
          {rows.map((rowSeats, rowIdx) => {
            // Horizontal View: LeftSeats are TOP, RightSeats are BOTTOM
            const topSeats = rowSeats.slice(0, 2);
            const bottomSeats = rowSeats.slice(2, 4);

            return (
              <div
                key={rowIdx}
                className="flex flex-col items-center w-8 sm:w-10 relative"
              >
                {/* Optional column indicator */}
                <span className="absolute -top-5 text-[8px] sm:text-[10px] font-bold text-zinc-300 pointer-events-none">
                  {rowIdx + 1}
                </span>

                {/* Top Side Seats */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {topSeats.map((seat, i) => (
                    <SeatCell
                      key={seat?._id || i}
                      seat={seat ?? null}
                      displayNumber={
                        seat?.seatNumber ? Number(seat.seatNumber) : 0
                      }
                      isWindow={i === 0} // Top-most is window
                      isAisle={i === 1} // Inner is aisle
                      isSelected={
                        seat ? selectedSeatIds.includes(seat._id) : false
                      }
                      onSeatClick={onSeatClick}
                    />
                  ))}
                </div>

                {/* Center Aisle Indicator */}
                <div className="h-6 sm:h-8 w-full flex items-center justify-center relative my-1">
                  <div className="w-full h-1.5 bg-zinc-200/80 rounded-full" />
                </div>

                {/* Bottom Side Seats */}
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {bottomSeats.map((seat, i) => (
                    <SeatCell
                      key={seat?._id || i}
                      seat={seat ?? null}
                      displayNumber={
                        seat?.seatNumber ? Number(seat.seatNumber) : 0
                      }
                      isWindow={i === 1} // Bottom-most is window
                      isAisle={i === 0} // Inner is aisle
                      isSelected={
                        seat ? selectedSeatIds.includes(seat._id) : false
                      }
                      onSeatClick={onSeatClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
