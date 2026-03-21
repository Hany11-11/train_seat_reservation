import { useNavigate } from 'react-router-dom';
import { Train, Calendar, LogOut, Ticket } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useBooking } from '@/hooks/useBooking';
import { formatDate, formatCurrency } from '@/utils/fareCalculator';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getUserBookings } = useBooking();

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const bookings = getUserBookings(user.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Train className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">RailBooker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <Button onClick={() => navigate('/')}>Book New Trip</Button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">Start by booking your first train journey!</p>
            <Button onClick={() => navigate('/')}>Search Trains</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Reference</p>
                    <p className="font-bold text-accent">{booking.referenceNumber}</p>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(booking.travelDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.seats.length} seat(s)</span>
                  </div>
                  <div className="ml-auto font-semibold">
                    {formatCurrency(booking.totalAmount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
