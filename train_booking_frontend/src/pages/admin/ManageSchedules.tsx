import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { AdminScheduleForm } from '@/components/organisms/AdminScheduleForm';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';

const ManageSchedules = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { schedules, trains, stations, addSchedule, updateSchedule, deleteSchedule, loading } = useAdmin();

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <AdminTemplate title="Manage Schedules" onLogout={() => { logout(); navigate('/admin/login'); }}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Manage Schedules" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <AdminScheduleForm
        schedules={schedules || []}
        trains={trains || []}
        stations={stations || []}
        onAdd={addSchedule}
        onUpdate={updateSchedule}
        onDelete={deleteSchedule}
      />
    </AdminTemplate>
  );
};

export default ManageSchedules;
