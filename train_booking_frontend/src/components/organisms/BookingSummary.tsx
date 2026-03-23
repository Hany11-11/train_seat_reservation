import { BookedSeat } from '@/types/booking';
import { BookingSearchResult } from '@/types/booking';
import { Badge } from '@/components/atoms/Badge';
import { formatCurrency, formatTime, formatDate } from '@/utils/fareCalculator';
import { Train, MapPin, Calendar, Ticket, User } from 'lucide-react';

interface BookingSummaryProps {
  trainInfo: BookingSearchResult;
  selectedClass?: string;
  selectedSeats: BookedSeat[];
  totalAmount: number;
  passengerCount?: number;
}

export const BookingSummary = ({ trainInfo, selectedClass, selectedSeats, totalAmount, passengerCount }: BookingSummaryProps) => {
  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case '1ST': return 'class1st';
      case '2ND': return 'class2nd';
      case '3RD': return 'class3rd';
      default: return 'secondary';
    }
  };

  const getClassName = (classType: string) => {
    switch (classType) {
      case '1ST': return '1st Class';
      case '2ND': return '2nd Class';
      case '3RD': return '3rd Class';
      default: return classType;
    }
  };

  const fromStationName = trainInfo.fromStationRoute?.name || trainInfo.fromStation?.name || trainInfo.fromStation;
  const toStationName = trainInfo.toStationRoute?.name || trainInfo.toStation?.name || trainInfo.toStation;
  const departureTime = trainInfo.fromStationRoute?.departureTime || trainInfo.departureTime;
  const arrivalTime = trainInfo.toStationRoute?.arrivalTime || trainInfo.arrivalTime;

  const seatsByClass = selectedSeats.reduce((acc, seat) => {
    if (!acc[seat.classType]) acc[seat.classType] = [];
    acc[seat.classType].push(seat);
    return acc;
  }, {} as Record<string, BookedSeat[]>);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="gradient-primary p-4">
        <h3 className="text-lg font-semibold text-primary-foreground">Booking Summary</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Train Info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Train className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{trainInfo.trainName}</p>
            <p className="text-sm text-muted-foreground">{trainInfo.trainNumber}</p>
          </div>
        </div>

        {/* Selected Class */}
        {selectedClass && (
          <div className="flex items-center gap-2">
            <Badge variant={getClassBadgeVariant(selectedClass)}>
              {getClassName(selectedClass)}
            </Badge>
          </div>
        )}

        {/* Route */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{fromStationName}</p>
              <p className="text-sm text-muted-foreground">{formatTime(departureTime)}</p>
            </div>
          </div>
          <div className="ml-2 border-l-2 border-dashed border-border h-4" />
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{toStationName}</p>
              <p className="text-sm text-muted-foreground">{formatTime(arrivalTime)}</p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Travel Date</p>
            <p className="font-medium">{formatDate(trainInfo.date)}</p>
          </div>
        </div>

        {/* Passengers */}
        {passengerCount && (
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Passengers</p>
              <p className="font-medium">{passengerCount}</p>
            </div>
          </div>
        )}

        {/* Selected Seats */}
        {selectedSeats.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="w-4 h-4 text-primary" />
              <p className="font-medium">Selected Seats</p>
            </div>
            <div className="space-y-2">
              {Object.entries(seatsByClass).map(([classType, seats]) => (
                <div key={classType} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={getClassBadgeVariant(classType)} size="sm">
                      {getClassName(classType)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(seats[0].price)} × {seats.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {seats.map(seat => (
                      <span 
                        key={seat.seatId} 
                        className="px-2 py-1 bg-card rounded text-xs font-medium"
                      >
                        {seat.coachName}-{seat.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-accent">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
