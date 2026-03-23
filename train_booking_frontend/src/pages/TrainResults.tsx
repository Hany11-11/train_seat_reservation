import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Train, Pencil } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { TrainResultsList } from '@/components/organisms/TrainResultsList';
import { TrainSearchForm } from '@/components/organisms/TrainSearchForm';
import { BookingSearchResult } from '@/types/booking';
import { STATIONS } from '@/types/schedule';
import { formatDate } from '@/utils/fareCalculator';
import { useBooking } from '@/hooks/useBooking';

const TrainResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, results } = location.state || { searchParams: null, results: [] };
  const { searchTrains } = useBooking();

  const [showModifyForm, setShowModifyForm] = useState(false);

  if (!searchParams) {
    navigate('/');
    return null;
  }

  const fromStation = STATIONS.find(s => s.id === searchParams.fromStationId);
  const toStation = STATIONS.find(s => s.id === searchParams.toStationId);

  const handleSelectTrain = (result: BookingSearchResult, classType: string) => {
    navigate('/seats', { state: { trainInfo: result, selectedClass: classType, passengers: searchParams.passengers } });
  };

  const handleModifySearch = () => {
    setShowModifyForm(!showModifyForm);
  };

  const handleSearch = async (params: {
    fromStationId: string;
    toStationId: string;
    date: string;
    passengers: number;
  }) => {
    const searchResults = await searchTrains(params);
    navigate('/results', { state: { searchParams: params, results: searchResults } });
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
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={handleModifySearch}
            className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {showModifyForm ? 'Close Modify Search' : 'Do you want to modify the search?'}
          </Button>
        </div>

        <div
          className={`mb-8 overflow-hidden transition-all duration-500 ease-in-out ${
            showModifyForm ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <TrainSearchForm 
            onSearch={handleSearch} 
            initialValues={{
              fromStationId: searchParams.fromStationId,
              toStationId: searchParams.toStationId,
              date: searchParams.date,
              passengers: searchParams.passengers,
            }}
          />
        </div>

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
