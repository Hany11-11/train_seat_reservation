import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTemplate } from '@/components/templates/AdminTemplate';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { usePrices } from '@/hooks/usePrices';
import { Price, PriceFormData } from '@/types/price';
import { Loader2, Plus, Pencil, Trash2, ArrowRight } from 'lucide-react';

const ManagePrices = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const { schedules, stations, loading: adminLoading } = useAdmin();
  const { prices, addPrice, updatePrice, deletePrice, loading } = usePrices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [formData, setFormData] = useState<PriceFormData>({
    schedule: '',
    fromStation: '',
    toStation: '',
    classType: '3RD',
    price: 0,
    status: 'ACTIVE',
  });

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const getStationName = (id: string) => {
    if (!id) return 'Unknown';
    const station = (stations as any[]).find((s: any) => s.id === id || s._id === id);
    return station?.name || id;
  };

  const getScheduleName = (id: string) => {
    if (!id) return 'Unknown';
    const schedule = (schedules as any[]).find((s: any) => s.id === id || s._id === id);
    return schedule?.trainData?.name || 'Unknown';
  };

  const getRouteStations = (scheduleId: string) => {
    if (!scheduleId || !schedules) return [];
    const schedule = (schedules as any[]).find((s: any) => s.id === scheduleId || s._id === scheduleId);
    if (!schedule?.route) return [];
    try {
      return schedule.route.map((stop: any, index: number) => {
        const stationId = typeof stop.station === 'object' ? (stop.station._id || stop.station.id) : stop.station;
        return {
          id: stationId || `route-stop-${index}`,
          name: getStationName(stationId),
        };
      });
    } catch (e) {
      console.error('Error getting route stations:', e);
      return [];
    }
  };

  const routeStations = formData.schedule ? getRouteStations(formData.schedule) : [];

  const handleOpenModal = (price?: Price) => {
    if (price) {
      setEditingPrice(price);
      setFormData({
        schedule: price.schedule,
        fromStation: price.fromStation,
        toStation: price.toStation,
        classType: price.classType,
        price: price.price,
        status: price.status,
      });
    } else {
      setEditingPrice(null);
      setFormData({
        schedule: '',
        fromStation: '',
        toStation: '',
        classType: '3RD',
        price: 0,
        status: 'ACTIVE',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrice) {
      await updatePrice(editingPrice.id, {
        schedule: formData.schedule,
        fromStation: formData.fromStation,
        toStation: formData.toStation,
        classType: formData.classType,
        price: formData.price,
        status: formData.status,
      });
    } else {
      await addPrice(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this price?')) {
      await deletePrice(id);
    }
  };

  if (adminLoading || loading) {
    return (
      <AdminTemplate title="Manage Prices" onLogout={() => { logout(); navigate('/admin/login'); }}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate title="Manage Prices" onLogout={() => { logout(); navigate('/admin/login'); }}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Price
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map(price => (
                <TableRow key={price.id}>
                  <TableCell className="font-medium">
                    {getScheduleName(price.schedule)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{getStationName(price.fromStation)}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span>{getStationName(price.toStation)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      price.classType === '1ST' ? 'class1st' : 
                      price.classType === '2ND' ? 'class2nd' : 'class3rd'
                    }>
                      {price.classType === '1ST' ? '1st Class' : 
                       price.classType === '2ND' ? '2nd Class' : '3rd Class'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    LKR {price.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant={price.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {price.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(price)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(price.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {prices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No prices found
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
            <Modal.Title>{editingPrice ? 'Edit Price' : 'Add New Price'}</Modal.Title>
            <Modal.Description>
              {editingPrice ? 'Update the price details.' : 'Create a new price for a segment.'}
            </Modal.Description>
          </Modal.Header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Select 
                value={formData.schedule} 
                onValueChange={(v) => setFormData(p => ({ ...p, schedule: v, fromStation: '', toStation: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((schedule: any) => {
                    const scheduleId = schedule._id || schedule.id;
                    return (
                      <SelectItem key={scheduleId} value={scheduleId}>
                        {getScheduleName(scheduleId)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Station</Label>
                <Select 
                  value={formData.fromStation} 
                  onValueChange={(v) => setFormData(p => ({ ...p, fromStation: v }))}
                  disabled={!formData.schedule || routeStations.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.schedule ? (routeStations.length > 0 ? "From" : "No stations in route") : "Select schedule first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routeStations && routeStations.length > 0 ? routeStations.map((station: any) => (
                      <SelectItem 
                        key={station.id} 
                        value={station.id}
                        disabled={station.id === formData.toStation}
                      >
                        {station.name}
                      </SelectItem>
                    )) : (
                      <div className="p-2 text-sm text-muted-foreground">No stations available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Station</Label>
                <Select 
                  value={formData.toStation} 
                  onValueChange={(v) => setFormData(p => ({ ...p, toStation: v }))}
                  disabled={!formData.schedule || routeStations.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.schedule ? (routeStations.length > 0 ? "To" : "No stations in route") : "Select schedule first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {routeStations && routeStations.length > 0 ? routeStations.map((station: any) => (
                      <SelectItem 
                        key={station.id} 
                        value={station.id}
                        disabled={station.id === formData.fromStation}
                      >
                        {station.name}
                      </SelectItem>
                    )) : (
                      <div className="p-2 text-sm text-muted-foreground">No stations available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select 
                value={formData.classType} 
                onValueChange={(v) => setFormData(p => ({ ...p, classType: v as '1ST' | '2ND' | '3RD' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1ST">1st Class</SelectItem>
                  <SelectItem value="2ND">2nd Class</SelectItem>
                  <SelectItem value="3RD">3rd Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price (LKR)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData(p => ({ ...p, status: v as 'ACTIVE' | 'INACTIVE' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Modal.Footer>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPrice ? 'Save Changes' : 'Add Price'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </AdminTemplate>
  );
};

export default ManagePrices;
