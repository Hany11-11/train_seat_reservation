import { BookingSearchResult } from '@/types/booking';
import { TrainInfoCard } from '@/components/molecules/TrainInfoCard';
import { Train } from 'lucide-react';

interface TrainResultsListProps {
  results: BookingSearchResult[];
  isLoading: boolean;
  onSelectTrain: (result: BookingSearchResult, classType: string) => void;
}

export const TrainResultsList = ({ results, isLoading, onSelectTrain }: TrainResultsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-5">
              <div className="h-8 w-20 bg-muted rounded" />
              <div className="h-1 w-40 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-10 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Train className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No trains found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or selecting a different date.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {results.length} train{results.length !== 1 ? 's' : ''} found
      </p>
      {results.map((result, index) => (
        <div 
          key={result.scheduleId} 
          style={{ animationDelay: `${index * 100}ms` }}
          className="animate-fade-in"
        >
          <TrainInfoCard result={result} onSelect={(classType) => onSelectTrain(result, classType)} />
        </div>
      ))}
    </div>
  );
};
