import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Train } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { TrainResultsList } from '@/components/organisms/TrainResultsList';
import { BookingSearchResult } from '@/types/booking';
import { STATIONS } from '@/types/schedule';
import { formatDate } from '@/utils/fareCalculator';

const TrainResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, results } = location.state || { searchParams: null, results: [] };

  if (!searchParams) {
    navigate('/');
    return null;
  }

  const fromStation = STATIONS.find(s => s.id === searchParams.fromStationId);
  const toStation = STATIONS.find(s => s.id === searchParams.toStationId);

  const handleSelectTrain = (result: BookingSearchResult) => {
    navigate('/seats', { state: { trainInfo: result, passengers: searchParams.passengers } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Train className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {fromStation?.name} → {toStation?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formatDate(searchParams.date)} • {searchParams.passengers} passenger(s)
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <TrainResultsList 
          results={results} 
          isLoading={false} 
          onSelectTrain={handleSelectTrain} 
        />
      </main>
    </div>
  );
};

export default TrainResults;
