import { useState } from 'react';
import { Train as TrainIcon, Clock, MapPin, ArrowRight, Play, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { BookingSearchResult } from '@/types/booking';
import { formatTime } from '@/utils/fareCalculator';
import { cn } from '@/lib/utils';

interface ClassAvailabilityData {
  totalSeats: number;
  availableSeats: number;
  coaches: Array<{
    coachName: string;
    totalSeats: number;
    layout?: string;
    rows: number;
    seatsPerRow: number;
  }>;
}

interface TrainInfoCardProps {
  result: BookingSearchResult;
  onSelect: (classType: string) => void;
}

const CLASS_NAMES: Record<string, string> = {
  '1ST': '1st Class',
  '2ND': '2nd Class',
  '3RD': '3rd Class',
};

export const TrainInfoCard = ({ result, onSelect }: TrainInfoCardProps) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  
  const availabilityEntries = Object.entries(result.availability || {}) as [string, ClassAvailabilityData][];
  const hasAvailableSeats = availabilityEntries.some(([, avail]) => avail.availableSeats > 0);

  const handleSelectClass = (classType: string, available: number) => {
    if (available > 0) {
      if (selectedClass === classType) {
        setSelectedClass(null);
      } else {
        setSelectedClass(classType);
      }
    }
  };

  const handleBookNow = () => {
    if (selectedClass) {
      onSelect(selectedClass);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in overflow-hidden">
      {/* Header with train info */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <TrainIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{result.trainName}</h3>
              <p className="text-xs text-muted-foreground">Train {result.trainNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">{result.duration}</span>
          </div>
        </div>
      </div>

      {/* Main journey times */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatTime(result.departureTime) || '--:--'}
            </p>
            <p className="text-sm font-medium text-foreground">
              {result.fromStation.name}
            </p>
            <p className="text-xs text-muted-foreground">{result.fromStation.code}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center w-full">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary to-accent" />
              <div className="w-3 h-3 rounded-full bg-accent flex items-center justify-center">
                <Play className="w-2 h-2 text-white fill-white" />
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-primary to-accent" />
            </div>
            {result.userDuration && (
              <span className="text-[10px] text-muted-foreground mt-1">
                Travel time: {result.userDuration}
              </span>
            )}
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatTime(result.arrivalTime) || '--:--'}
            </p>
            <p className="text-sm font-medium text-foreground">
              {result.toStation.name}
            </p>
            <p className="text-xs text-muted-foreground">{result.toStation.code}</p>
          </div>
        </div>
      </div>

      {/* Boarding/Alighting stations */}
      {result.fromStationRoute && result.toStationRoute && (
        <div className="px-4 pb-3">
          <div className="bg-muted/50 rounded-lg p-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-green-600" />
              <span className="text-[10px] text-muted-foreground">Board:</span>
              <span className="text-xs font-semibold text-foreground">
                {formatTime(result.fromStationRoute.departureTime)} - {result.fromStationRoute.name}
              </span>
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-red-600" />
              <span className="text-[10px] text-muted-foreground">Alight:</span>
              <span className="text-xs font-semibold text-foreground">
                {formatTime(result.toStationRoute.arrivalTime)} - {result.toStationRoute.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Class prices - Selectable */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-muted-foreground mb-2">Select a class:</p>
        <div className={cn('flex gap-2', availabilityEntries.length === 1 && 'max-w-[120px]', availabilityEntries.length === 2 && 'max-w-[240px]')}>
          {availabilityEntries.map(([classType, avail]) => {
            const isSelected = selectedClass === classType;
            const isAvailable = avail.availableSeats > 0;
            
            return (
              <div 
                key={classType} 
                className={cn(
                  'rounded-lg p-2 text-center transition-all cursor-pointer border-2 relative',
                  isAvailable
                    ? isSelected
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-transparent bg-primary/5 hover:bg-primary/10'
                    : 'border-muted bg-muted/30 cursor-not-allowed opacity-60',
                  availabilityEntries.length === 1 && 'flex-1 min-w-[100px]',
                  availabilityEntries.length === 2 && 'flex-1 min-w-[100px]',
                  availabilityEntries.length >= 3 && 'flex-1'
                )}
                onClick={() => handleSelectClass(classType, avail.availableSeats)}
              >
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <p className={cn(
                  'text-[10px] font-semibold mb-0.5',
                  classType === '1ST' ? 'text-purple-600' : classType === '2ND' ? 'text-blue-600' : 'text-green-600'
                )}>
                  {CLASS_NAMES[classType] || classType}
                </p>
                <p className={cn(
                  'text-sm font-bold',
                  isAvailable ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  Rs. {(result.prices?.[classType as keyof typeof result.prices] || 0).toLocaleString()}
                </p>
                <p className={cn(
                  'text-[10px]',
                  avail.availableSeats > 10 
                    ? 'text-green-600' 
                    : avail.availableSeats > 0 
                      ? 'text-orange-500' 
                      : 'text-muted-foreground'
                )}>
                  {avail.availableSeats > 0 
                    ? `${avail.availableSeats} seats` 
                    : 'Sold out'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Select button */}
      <div className="px-4 pb-4">
        <Button 
          onClick={handleBookNow} 
          className={cn(
            'w-full font-semibold transition-all',
            selectedClass
              ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
          disabled={!selectedClass}
        >
          {selectedClass ? `Book ${CLASS_NAMES[selectedClass]}` : 'Select a Class'}
        </Button>
      </div>
    </div>
  );
};
