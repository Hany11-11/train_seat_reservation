import { useState } from 'react';
import { Schedule, Station } from '@/types/schedule';
import { Train } from '@/types/train';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { SearchField } from '@/components/molecules/SearchField';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Clock, Calendar } from 'lucide-react';
import { formatTime } from '@/utils/fareCalculator';

interface AdminScheduleFormProps {
  schedules: Schedule[];
  trains: Train[];
  stations: Station[];
  onAdd: (schedule: Omit<Schedule, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Schedule>) => void;
  onDelete: (id: string) => void;
}

export const AdminScheduleForm = ({ 
  schedules, 
  trains, 
  stations, 
  onAdd, 
  onUpdate, 
  onDelete 
}: AdminScheduleFormProps) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    trainId: '',
    fromStationId: '',
    toStationId: '',
    departureTime: '',
    arrivalTime: '',
    durationMinutes: 0,
    isActive: true,
  });

  const getTrainName = (trainId: string) => trains.find(t => t.id === trainId)?.name || trainId;
  const getStationName = (stationId: string) => stations.find(s => s.id === stationId)?.name || stationId;

  const filteredSchedules = schedules.filter(schedule => {
    const trainName = getTrainName(schedule.trainId).toLowerCase();
    const fromStation = getStationName(schedule.fromStationId).toLowerCase();
    const toStation = getStationName(schedule.toStationId).toLowerCase();
    const searchLower = search.toLowerCase();
    return trainName.includes(searchLower) || fromStation.includes(searchLower) || toStation.includes(searchLower);
  });

  const handleOpenModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        trainId: schedule.trainId,
        fromStationId: schedule.fromStationId,
        toStationId: schedule.toStationId,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        durationMinutes: schedule.durationMinutes,
        isActive: schedule.isActive,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        trainId: '',
        fromStationId: '',
        toStationId: '',
        departureTime: '',
        arrivalTime: '',
        durationMinutes: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const calculateDuration = (departure: string, arrival: string): number => {
    if (!departure || !arrival) return 0;
    const [depH, depM] = departure.split(':').map(Number);
    const [arrH, arrM] = arrival.split(':').map(Number);
    let minutes = (arrH * 60 + arrM) - (depH * 60 + depM);
    if (minutes < 0) minutes += 24 * 60; // Handle overnight journeys
    return minutes;
  };

  const handleTimeChange = (field: 'departureTime' | 'arrivalTime', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (updated.departureTime && updated.arrivalTime) {
        updated.durationMinutes = calculateDuration(updated.departureTime, updated.arrivalTime);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduleData = {
      ...formData,
      travelDates: editingSchedule?.travelDates || generateDates(30),
    };
    
    if (editingSchedule) {
      onUpdate(editingSchedule.id, scheduleData);
    } else {
      onAdd(scheduleData);
    }
    setIsModalOpen(false);
  };

  const generateDates = (days: number): string[] => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search schedules..."
          className="sm:w-64"
        />
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map(schedule => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{getTrainName(schedule.trainId)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{getStationName(schedule.fromStationId)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{getStationName(schedule.toStationId)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{formatTime(schedule.departureTime)}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{formatTime(schedule.arrivalTime)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {Math.floor(schedule.durationMinutes / 60)}h {schedule.durationMinutes % 60}m
                </TableCell>
                <TableCell>
                  <Badge variant={schedule.isActive ? 'success' : 'secondary'}>
                    {schedule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(schedule)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredSchedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No schedules found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content className="max-w-md">
          <Modal.Header>
            <Modal.Title>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</Modal.Title>
            <Modal.Description>
              {editingSchedule ? 'Update the schedule details.' : 'Create a new train schedule.'}
            </Modal.Description>
          </Modal.Header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Train</Label>
              <Select value={formData.trainId} onValueChange={(v) => setFormData(p => ({ ...p, trainId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {trains.filter(t => t.isActive).map(train => (
                    <SelectItem key={train.id} value={train.id}>
                      {train.name} ({train.trainNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Station</Label>
                <Select value={formData.fromStationId} onValueChange={(v) => setFormData(p => ({ ...p, fromStationId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map(station => (
                      <SelectItem key={station.id} value={station.id} disabled={station.id === formData.toStationId}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Station</Label>
                <Select value={formData.toStationId} onValueChange={(v) => setFormData(p => ({ ...p, toStationId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map(station => (
                      <SelectItem key={station.id} value={station.id} disabled={station.id === formData.fromStationId}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => handleTimeChange('departureTime', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => handleTimeChange('arrivalTime', e.target.value)}
                  required
                />
              </div>
            </div>

            {formData.durationMinutes > 0 && (
              <p className="text-sm text-muted-foreground">
                Duration: {Math.floor(formData.durationMinutes / 60)}h {formData.durationMinutes % 60}m
              </p>
            )}

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
                {editingSchedule ? 'Save Changes' : 'Add Schedule'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};
