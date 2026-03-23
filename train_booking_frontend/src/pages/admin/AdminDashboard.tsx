import { useNavigate } from 'react-router-dom';
import { Train, Calendar, Ticket, DollarSign, Armchair, TrendingUp, Loader2 } from 'lucide-react';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { formatCurrency } from '@/utils/fareCalculator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, isAdmin, isLoading } = useAuth();
  const { dashboardStats } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Total Bookings', value: dashboardStats.bookings.total, icon: Ticket, color: 'text-info' },
    { label: 'Revenue', value: formatCurrency(dashboardStats.bookings.revenue), icon: DollarSign, color: 'text-success' },
    { label: 'Active Trains', value: dashboardStats.trains.active, icon: Train, color: 'text-primary' },
    { label: 'Active Schedules', value: dashboardStats.schedules.active, icon: Calendar, color: 'text-accent' },
    { label: 'Total Seats', value: dashboardStats.seats.totalSeats, icon: Armchair, color: 'text-warning' },
    { label: 'Confirmed', value: dashboardStats.bookings.confirmed, icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <AdminTemplate title="Dashboard" onLogout={handleLogout}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminTemplate>
  );
};

export default AdminDashboard;
