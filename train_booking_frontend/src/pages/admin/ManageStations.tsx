import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useStations } from '@/hooks/useStations';
import { Station } from '@/types/schedule';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

const ManageStations = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { stations, addStation, updateStation, deleteStation } = useStations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
  });

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleOpenModal = (station?: Station) => {
    if (station) {
      setEditingStation(station);
      setFormData({
        name: station.name,
        code: station.code,
        city: station.city,
      });
    } else {
      setEditingStation(null);
      setFormData({
        name: '',
        code: '',
        city: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStation) {
      updateStation(editingStation.id, formData);
    } else {
      addStation(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      deleteStation(id);
    }
  };

  return (
    <AdminTemplate title="Manage Stations" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Station
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map(station => (
                <TableRow key={station.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{station.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono">{station.code}</TableCell>
                  <TableCell className="text-muted-foreground">{station.city}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(station)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(station.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {stations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No stations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>{editingStation ? 'Edit Station' : 'Add New Station'}</Modal.Title>
            <Modal.Description>
              {editingStation ? 'Update the station details below.' : 'Fill in the details to add a new station.'}
            </Modal.Description>
          </Modal.Header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Station Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Colombo Fort"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Station Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., COL"
                maxLength={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., Colombo"
                required
              />
            </div>

            <Modal.Footer>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingStation ? 'Save Changes' : 'Add Station'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </AdminTemplate>
  );
};

export default ManageStations;
