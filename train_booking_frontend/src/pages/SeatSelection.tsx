import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { SeatLayout } from '@/components/organisms/SeatLayout';
import { BookingSummary } from '@/components/organisms/BookingSummary';
import { useSeatSelection } from '@/hooks/useSeatSelection';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainInfo, selectedClass, passengers } = location.state || {};

  const ticketPrice = trainInfo?.prices?.[selectedClass]?.price || 0;

  const {
    coaches,
    activeCoachId,
    selectedSeats,
    totalAmount,
    setActiveCoachId,
    toggleSeatSelection,
    getSelectedSeatsAsBookedSeats,
  } = useSeatSelection(
    trainInfo?.scheduleId || '', 
    trainInfo?.date || '', 
    selectedClass,
    ticketPrice,
    passengers
  );

  if (!trainInfo) {
    navigate('/');
    return null;
  }

  const handleContinue = () => {
    navigate('/checkout', {
      state: {
        trainInfo,
        selectedClass,
        selectedSeats: getSelectedSeatsAsBookedSeats(),
        totalAmount,
        passengers,
      },
    });
  };

  const getClassName = (classType: string) => {
    switch (classType) {
      case '1ST': return '1st Class';
      case '2ND': return '2nd Class';
      case '3RD': return '3rd Class';
      default: return classType;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Seats</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {trainInfo.trainName} - {getClassName(selectedClass)} - {trainInfo.date}
            </p>
            <SeatLayout
              coaches={coaches}
              activeCoachId={activeCoachId}
              selectedSeatIds={selectedSeats.map(s => s._id)}
              onCoachSelect={setActiveCoachId}
              onSeatClick={toggleSeatSelection}
            />
          </div>

          <div className="space-y-4">
            <BookingSummary
              trainInfo={trainInfo}
              selectedClass={selectedClass}
              selectedSeats={getSelectedSeatsAsBookedSeats()}
              totalAmount={totalAmount}
              passengerCount={passengers}
            />
            <Button
              onClick={handleContinue}
              disabled={selectedSeats.length !== passengers}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {selectedSeats.length === 0 
                ? 'Select Seats to Continue' 
                : selectedSeats.length < passengers 
                  ? `Select ${passengers - selectedSeats.length} More Seat${passengers - selectedSeats.length > 1 ? 's' : ''}`
                  : 'Continue to Checkout'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;
