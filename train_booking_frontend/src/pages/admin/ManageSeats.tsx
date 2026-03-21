import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { AdminSeatEditor } from '@/components/organisms/AdminSeatEditor';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

const ManageSeats = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { coaches, trains, addCoach, updateCoach, deleteCoach } = useAdmin();

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <AdminTemplate title="Manage Seats & Coaches" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <AdminSeatEditor
        coaches={coaches}
        trains={trains}
        onAdd={addCoach}
        onUpdate={updateCoach}
        onDelete={deleteCoach}
      />
    </AdminTemplate>
  );
};

export default ManageSeats;
