import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { CoachWithSeats, SeatAvailability } from "@/services/seatService";

interface HorizontalCoachViewProps {
  coach: CoachWithSeats;
  selectedSeatIds: string[];
  onSeatClick: (seat: SeatAvailability) => void;
}

// ─── SLR Seat Numbering Logic ────────────────────────────────────────────────
// Real SLR 2+2 layout:
//   Row 0 (even): Left=1,2  Right=3,4
//   Row 1 (odd):  Left=7,8  Right=5,6
//   Row 2 (even): Left=9,10 Right=11,12
//   Row 3 (odd):  Left=15,16 Right=13,14 … etc.
function getSLRSeatNumbers(rowIndex: number): {
  left: [number, number];
  right: [number, number];
} {
  if (rowIndex % 2 === 0) {
    const base = rowIndex * 4;
    return { left: [base + 1, base + 2], right: [base + 3, base + 4] };
  } else {
    const base = rowIndex * 4;
    return { left: [base + 3, base + 4], right: [base + 1, base + 2] };
  }
}

// ─── Seat Cell ────────────────────────────────────────────────────────────────
interface SeatCellProps {
  seat: SeatAvailability | null;
  displayNumber: number;
  /** true = window seat (outermost), false = aisle seat */
  isWindow: boolean;
  isSelected: boolean;
  onSeatClick: (seat: SeatAvailability) => void;
}

const SeatCell = ({
  seat,
  displayNumber,
  isWindow,
  isSelected,
  onSeatClick,
}: SeatCellProps) => {
  if (!seat) {
    return (
      <div className="slr-seat slr-seat--empty">
        <span>{displayNumber}</span>
      </div>
    );
  }

  const status = seat.status;
  const clickable = status === "available";

  return (
    <button
      type="button"
      onClick={clickable ? () => onSeatClick(seat) : undefined}
      disabled={!clickable}
      aria-label={`Seat ${displayNumber} – ${isWindow ? "Window" : "Aisle"} – ${status}`}
      className={cn(
        "slr-seat",
        status === "available" && !isSelected && "slr-seat--available",
        status === "available" && isSelected && "slr-seat--selected",
        status === "booked" && "slr-seat--booked",
        status === "unavailable" && "slr-seat--unavailable",
      )}
    >
      {/* W / A corner badge */}
      <span className="slr-seat__badge">{isWindow ? "W" : "A"}</span>
      {/* Seat number */}
      <span className="slr-seat__num">{displayNumber}</span>
    </button>
  );
};

// ─── Door End Panel ───────────────────────────────────────────────────────────
const DoorEnd = ({
  side,
  hasToilet,
}: {
  side: "left" | "right";
  hasToilet?: boolean;
}) => (
  <div className={cn("slr-end", `slr-end--${side}`)}>
    <div className="slr-door-pill slr-door-pill--top">DOOR</div>

    {hasToilet && <div className="slr-toilet-text">TOILET</div>}

    <div className="slr-center-door">DOOR</div>

    <div className="slr-door-pill slr-door-pill--bottom">DOOR</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const totalRows = rows.length;
  const midRow = Math.floor(totalRows / 2);

  return (
    <div className="slr-coach-wrapper">
      {/* ── Direction Banner ─────────────────────────────────── */}
      <div className="slr-direction-banner">
        <div className="slr-direction-label">
          <span className="slr-arrow slr-arrow--left">◀◀</span>
          <span>Seat Direction</span>
          <span className="slr-arrow slr-arrow--right">▶▶</span>
        </div>
      </div>

      {/* ── W / A Legend ─────────────────────────────────────── */}
      <div className="slr-wa-legend">
        <span className="slr-wa-legend__item slr-wa-legend__item--w">
          <span className="slr-wa-badge slr-wa-badge--tl">W</span> Window Seat
        </span>
        <span className="slr-wa-legend__item slr-wa-legend__item--a">
          <span className="slr-wa-badge slr-wa-badge--tr">A</span> Aisle Seat
        </span>
      </div>

      {/* ── Coach Shell ──────────────────────────────────────── */}
      <div className="slr-coach-scroll">
        <div className="slr-coach">
          {/* ╔═ LEFT END: DOOR + TOILET ════════════════════════╗ */}
          <DoorEnd side="left" hasToilet />

          {/* ╠═ SEAT BODY ══════════════════════════════════════╣ */}
          <div className="slr-seats-section">
            {/* Window row label */}
            <div className="slr-rail slr-rail--top">Window Side</div>

            {/* Seat grid */}
            <div className="slr-seat-grid">
              {rows.map((rowSeats, rowIdx) => {
                const leftSeats = rowSeats.slice(0, 2);
                const rightSeats = rowSeats.slice(2, 4);

                return (
                  <div key={rowIdx} className="slr-column">
                    {/* Upper bank: 2 window-side seats */}
                    <div className="slr-bank slr-bank--upper">
                      <SeatCell
                        seat={leftSeats[0] ?? null}
                        displayNumber={
                          leftSeats[0]?.seatNumber
                            ? Number(leftSeats[0].seatNumber)
                            : 0
                        }
                        isWindow={true}
                        isSelected={
                          leftSeats[0]
                            ? selectedSeatIds.includes(leftSeats[0]._id)
                            : false
                        }
                        onSeatClick={onSeatClick}
                      />
                      <SeatCell
                        seat={leftSeats[1] ?? null}
                        displayNumber={
                          leftSeats[1]?.seatNumber
                            ? Number(leftSeats[1].seatNumber)
                            : 0
                        }
                        isWindow={false}
                        isSelected={
                          leftSeats[1]
                            ? selectedSeatIds.includes(leftSeats[1]._id)
                            : false
                        }
                        onSeatClick={onSeatClick}
                      />
                    </div>

                    {/* Aisle gap */}
                    <div className="slr-aisle-marker">
                      {rowIdx === midRow && (
                        <span className="slr-direction-arrow">▲▼</span>
                      )}
                    </div>

                    {/* Lower bank: 2 aisle-side seats */}
                    <div className="slr-bank slr-bank--lower">
                      <SeatCell
                        seat={rightSeats[0] ?? null}
                        displayNumber={
                          rightSeats[0]?.seatNumber
                            ? Number(rightSeats[0].seatNumber)
                            : 0
                        }
                        isWindow={false}
                        isSelected={
                          rightSeats[0]
                            ? selectedSeatIds.includes(rightSeats[0]._id)
                            : false
                        }
                        onSeatClick={onSeatClick}
                      />
                      <SeatCell
                        seat={rightSeats[1] ?? null}
                        displayNumber={
                          rightSeats[1]?.seatNumber
                            ? Number(rightSeats[1].seatNumber)
                            : 0
                        }
                        isWindow={true}
                        isSelected={
                          rightSeats[1]
                            ? selectedSeatIds.includes(rightSeats[1]._id)
                            : false
                        }
                        onSeatClick={onSeatClick}
                      />
                    </div>

                    {/* Row label */}
                    <div className="slr-col-label">R{rowIdx + 1}</div>
                  </div>
                );
              })}
            </div>

            {/* window row label */}
            <div className="slr-rail slr-rail--bottom">Window Side</div>
          </div>

          {/* ╚═ RIGHT END: DOOR ONLY ══════════════════════════╝ */}
          <DoorEnd side="right" />
        </div>
      </div>
    </div>
  );
};
