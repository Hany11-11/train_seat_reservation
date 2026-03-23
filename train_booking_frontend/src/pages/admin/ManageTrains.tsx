import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { AdminTrainTable } from '@/components/organisms/AdminTrainTable';
import { useAuth } from '@/hooks/useAuth';
import { useTrains } from '@/hooks/useTrains';

const ManageTrains = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { trains, addTrain, updateTrain, deleteTrain } = useTrains();

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <AdminTemplate title="Manage Trains" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <AdminTrainTable
        trains={trains}
        onAdd={addTrain}
        onUpdate={updateTrain}
        onDelete={deleteTrain}
      />
    </AdminTemplate>
  );
};

export default ManageTrains;
