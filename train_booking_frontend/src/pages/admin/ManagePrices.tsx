import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { PriceForm } from '@/components/molecules/PriceForm';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Pencil } from 'lucide-react';

const ManagePrices = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { schedules, trains, stations, prices, updatePrice, getPricesForSchedule } = useAdmin();
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const getTrainName = (trainId: string) => trains.find(t => t.id === trainId)?.name || trainId;
  const getStationName = (stationId: string) => stations.find(s => s.id === stationId)?.name || stationId;

  const handleSavePrices = (updatedPrices: { id: string; basePrice: number }[]) => {
    updatedPrices.forEach(p => updatePrice(p.id, { basePrice: p.basePrice }));
    setEditingScheduleId(null);
  };

  const schedulePrices = editingScheduleId ? getPricesForSchedule(editingScheduleId) : [];

  return (
    <AdminTemplate title="Manage Prices" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>1st Class</TableHead>
              <TableHead>2nd Class</TableHead>
              <TableHead>3rd Class</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map(schedule => {
              const schedulePrices = getPricesForSchedule(schedule.id);
              return (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{getTrainName(schedule.trainId)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {getStationName(schedule.fromStationId)} → {getStationName(schedule.toStationId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="class1st">
                      LKR {schedulePrices.find(p => p.classType === '1ST')?.basePrice || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="class2nd">
                      LKR {schedulePrices.find(p => p.classType === '2ND')?.basePrice || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="class3rd">
                      LKR {schedulePrices.find(p => p.classType === '3RD')?.basePrice || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditingScheduleId(schedule.id)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Modal.Root open={!!editingScheduleId} onOpenChange={() => setEditingScheduleId(null)}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Prices</Modal.Title>
            <Modal.Description>Update ticket prices for this route</Modal.Description>
          </Modal.Header>
          {schedulePrices.length > 0 && (
            <PriceForm
              prices={schedulePrices}
              onSave={handleSavePrices}
              onCancel={() => setEditingScheduleId(null)}
            />
          )}
        </Modal.Content>
      </Modal.Root>
    </AdminTemplate>
  );
};

export default ManagePrices;
