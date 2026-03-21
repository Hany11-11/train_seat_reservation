import { Train as TrainIcon, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { BookingSearchResult, ClassAvailability } from '@/types/booking';
import { formatTime } from '@/utils/fareCalculator';
import { cn } from '@/lib/utils';

interface TrainInfoCardProps {
  result: BookingSearchResult;
  onSelect: () => void;
}

export const TrainInfoCard = ({ result, onSelect }: TrainInfoCardProps) => {
  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case '1ST': return 'class1st';
      case '2ND': return 'class2nd';
      case '3RD': return 'class3rd';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      {/* Train header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrainIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{result.trainName}</h3>
            <p className="text-sm text-muted-foreground">{result.trainNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{result.duration}</span>
        </div>
      </div>

      {/* Journey info */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1">
          <p className="text-2xl font-bold text-foreground">{formatTime(result.departureTime)}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {result.fromStation}
          </p>
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-2 px-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent" />
          <ChevronRight className="w-4 h-4 text-accent" />
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-primary" />
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>

        <div className="flex-1 text-right">
          <p className="text-2xl font-bold text-foreground">{formatTime(result.arrivalTime)}</p>
          <p className="text-sm text-muted-foreground flex items-center justify-end gap-1">
            <MapPin className="w-3 h-3" />
            {result.toStation}
          </p>
        </div>
      </div>

      {/* Class availability */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {result.availability.map((avail: ClassAvailability) => (
          <div 
            key={avail.classType} 
            className={cn(
              'p-3 rounded-lg border text-center transition-colors',
              avail.availableSeats > 0 
                ? 'bg-card border-border hover:border-primary/50' 
                : 'bg-muted/50 border-muted'
            )}
          >
            <Badge variant={getClassBadgeVariant(avail.classType)} size="sm" className="mb-2">
              {avail.className}
            </Badge>
            <p className={cn(
              'text-lg font-bold',
              avail.availableSeats > 0 ? 'text-foreground' : 'text-muted-foreground'
            )}>
              LKR {avail.price.toLocaleString()}
            </p>
            <p className={cn(
              'text-xs',
              avail.availableSeats > 10 
                ? 'text-success' 
                : avail.availableSeats > 0 
                  ? 'text-warning' 
                  : 'text-muted-foreground'
            )}>
              {avail.availableSeats > 0 
                ? `${avail.availableSeats} seats available` 
                : 'Sold out'}
            </p>
          </div>
        ))}
      </div>

      {/* Select button */}
      <Button 
        onClick={onSelect} 
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        disabled={result.availability.every(a => a.availableSeats === 0)}
      >
        Select Train
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
