import { useState } from 'react';
import { Train } from '@/types/train';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { SearchField } from '@/components/molecules/SearchField';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Train as TrainIcon } from 'lucide-react';

interface AdminTrainTableProps {
  trains: Train[];
  onAdd: (train: Omit<Train, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, data: Partial<Train>) => void;
  onDelete: (id: string) => void;
}

export const AdminTrainTable = ({ trains, onAdd, onUpdate, onDelete }: AdminTrainTableProps) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  const [formData, setFormData] = useState({
    trainNumber: '',
    name: '',
    description: '',
    isActive: true,
  });

  const filteredTrains = trains.filter(train =>
    train.name.toLowerCase().includes(search.toLowerCase()) ||
    train.trainNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (train?: Train) => {
    if (train) {
      setEditingTrain(train);
      setFormData({
        trainNumber: train.trainNumber,
        name: train.name,
        description: train.description || '',
        isActive: train.isActive,
      });
    } else {
      setEditingTrain(null);
      setFormData({
        trainNumber: '',
        name: '',
        description: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrain) {
      onUpdate(editingTrain.id, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search trains..."
          className="sm:w-64"
        />
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Train
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrains.map(train => (
              <TableRow key={train.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrainIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{train.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{train.trainNumber}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {train.description || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={train.isActive ? 'success' : 'secondary'}>
                    {train.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(train)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(train.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTrains.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No trains found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>{editingTrain ? 'Edit Train' : 'Add New Train'}</Modal.Title>
            <Modal.Description>
              {editingTrain ? 'Update the train details below.' : 'Fill in the details to add a new train.'}
            </Modal.Description>
          </Modal.Header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trainNumber">Train Number</Label>
              <Input
                id="trainNumber"
                value={formData.trainNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, trainNumber: e.target.value }))}
                placeholder="e.g., EXP-1001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Train Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Udarata Menike"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>

            <Modal.Footer>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTrain ? 'Save Changes' : 'Add Train'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};
