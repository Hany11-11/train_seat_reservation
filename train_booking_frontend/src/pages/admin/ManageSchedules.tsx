import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { AdminScheduleForm } from '@/components/organisms/AdminScheduleForm';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

const ManageSchedules = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { schedules, trains, stations, addSchedule, updateSchedule, deleteSchedule } = useAdmin();

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <AdminTemplate title="Manage Schedules" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <AdminScheduleForm
        schedules={schedules}
        trains={trains}
        stations={stations}
        onAdd={addSchedule}
        onUpdate={updateSchedule}
        onDelete={deleteSchedule}
      />
    </AdminTemplate>
  );
};

export default ManageSchedules;
