import { useState, useEffect } from "react";
import {
  Schedule,
  Station,
  RouteStop,
  ScheduleFormData,
} from "@/types/schedule";
import { Train } from "@/types/train";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { SearchField } from "@/components/molecules/SearchField";
import { Modal } from "@/components/atoms/Modal";
import { Input } from "@/components/atoms/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  ArrowRight,
  GripVertical,
  X,
} from "lucide-react";

interface AdminScheduleFormProps {
  schedules: Schedule[];
  trains: Train[];
  stations: Station[];
  onAdd: (schedule: ScheduleFormData) => void;
  onUpdate: (id: string, data: Partial<ScheduleFormData>) => void;
  onDelete: (id: string) => void;
}

export const AdminScheduleForm = ({
  schedules = [],
  trains = [],
  stations = [],
  onAdd,
  onUpdate,
  onDelete,
}: AdminScheduleFormProps) => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<ScheduleFormData>({
    train: "",
    fromStation: "",
    toStation: "",
    route: [],
    status: "ACTIVE",
  });

  // Auto-fill route whenever fromStation or toStation changes
  useEffect(() => {
    if (formData.fromStation && formData.toStation) {
      autoFillRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fromStation, formData.toStation]);

  const getTrainName = (schedule: any) => {
    if (schedule.trainData?.name) return schedule.trainData.name;
    if (schedule.train?.name) return schedule.train.name;
    if (!schedule.train) return "Unknown";
    const train = (trains as any[]).find(
      (t) => t.id === schedule.train || t._id === schedule.train,
    );
    return train?.name || "Unknown";
  };

  const getStationName = (schedule: any, type: "from" | "to") => {
    const stationId =
      type === "from" ? schedule.fromStation : schedule.toStation;
    const stationData =
      type === "from" ? schedule.fromStationData : schedule.toStationData;
    if (stationData?.name) return stationData.name;
    if (stationId?.name) return stationId.name;
    if (!stationId || stationId === "Unknown") return "Unknown";
    if (typeof stationId === "object") {
      return stationId?.name || "Unknown";
    }
    const station = (stations as any[]).find(
      (s) => s.id === stationId || s._id === stationId,
    );
    return station?.name || "Unknown";
  };

  const filteredSchedules = (schedules || []).filter((schedule: any) => {
    const trainName = getTrainName(schedule).toLowerCase();
    const fromStation = getStationName(schedule, "from").toLowerCase();
    const toStation = getStationName(schedule, "to").toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      trainName.includes(searchLower) ||
      fromStation.includes(searchLower) ||
      toStation.includes(searchLower)
    );
  });

  const handleOpenModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        train: schedule.train,
        fromStation: schedule.fromStation,
        toStation: schedule.toStation,
        route: [...schedule.route],
        status: schedule.status,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        train: "",
        fromStation: "",
        toStation: "",
        route: [],
        status: "ACTIVE",
      });
    }
    setIsModalOpen(true);
  };

  const addRouteStop = (stationId: string) => {
    if (!stationId || formData.route.some((s) => s.station === stationId))
      return;
    setFormData((prev) => ({
      ...prev,
      route: [
        ...prev.route,
        { station: stationId, arrivalTime: "", departureTime: "" },
      ],
    }));
  };

  const removeRouteStop = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      route: prev.route.filter((_, i) => i !== index),
    }));
  };

  const updateRouteStop = (
    index: number,
    field: keyof RouteStop,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      route: prev.route.map((stop, i) =>
        i === index ? { ...stop, [field]: value } : stop,
      ),
    }));
  };

  const autoFillRoute = () => {
    if (formData.fromStation && formData.toStation) {
      const fromIndex = stations.findIndex(
        (s) => s.id === formData.fromStation,
      );
      const toIndex = stations.findIndex((s) => s.id === formData.toStation);

      if (fromIndex !== -1 && toIndex !== -1) {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const routeStops: RouteStop[] = stations
          .slice(start, end + 1)
          .map((station) => ({
            station: station.id,
            arrivalTime: "",
            departureTime: "",
          }));
        setFormData((prev) => ({ ...prev, route: routeStops }));
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.train) {
      alert("Please select a train");
      return false;
    }
    if (!formData.fromStation || !formData.toStation) {
      alert("Please select from and to stations");
      return false;
    }
    if (formData.route.length < 2) {
      alert("Route must have at least 2 stations");
      return false;
    }
    const routeStationIds = formData.route.map((s) => s.station);
    if (
      !routeStationIds.includes(formData.fromStation) ||
      !routeStationIds.includes(formData.toStation)
    ) {
      alert("From and To stations must be included in the route");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingSchedule) {
      onUpdate(editingSchedule.id, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
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
              <TableHead>Stops</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((schedule: any) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {getTrainName(schedule).charAt(0)}
                      </span>
                    </div>
                    <span>{getTrainName(schedule)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{getStationName(schedule, "from")}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span>{getStationName(schedule, "to")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {schedule.route.length} stops
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      schedule.status === "ACTIVE" ? "success" : "secondary"
                    }
                  >
                    {schedule.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(schedule)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredSchedules.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No schedules found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <Modal.Header>
            <Modal.Title>
              {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
            </Modal.Title>
            <Modal.Description>
              {editingSchedule
                ? "Update the schedule details."
                : "Create a new train schedule with route."}
            </Modal.Description>
          </Modal.Header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Train</Label>
              <Select
                value={formData.train}
                onValueChange={(v) => setFormData((p) => ({ ...p, train: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {trains
                    .filter((t) => t.isActive)
                    .map((train) => (
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
                <Select
                  value={formData.fromStation}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, fromStation: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select from station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem
                        key={station.id}
                        value={station.id}
                        disabled={station.id === formData.toStation}
                      >
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Station</Label>
                <Select
                  value={formData.toStation}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, toStation: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select to station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem
                        key={station.id}
                        value={station.id}
                        disabled={station.id === formData.fromStation}
                      >
                        {station.name} ({station.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Route</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={autoFillRoute}
                  disabled={!formData.fromStation || !formData.toStation}
                >
                  Auto Fill
                </Button>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center gap-3 bg-card p-2 rounded-lg border mb-3 text-xs font-medium text-muted-foreground">
                  <div className="w-10 text-center">#</div>
                  <div className="flex-1">Station</div>
                  <div className="w-32 text-center">Arrival</div>
                  <div className="w-32 text-center">Departure</div>
                  <div className="w-10"></div>
                </div>

                {formData.route.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Add stations to build the route
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formData.route.map((stop, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-card p-3 rounded-lg border"
                      >
                        <span className="w-10 text-center text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {getStationName({ toStation: stop.station }, "to")}
                          </p>
                        </div>
                        <div className="w-32">
                          <Input
                            type="time"
                            value={stop.arrivalTime || ""}
                            onChange={(e) =>
                              updateRouteStop(
                                index,
                                "arrivalTime",
                                e.target.value,
                              )
                            }
                            className="h-9 text-sm text-center"
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="time"
                            value={stop.departureTime || ""}
                            onChange={(e) =>
                              updateRouteStop(
                                index,
                                "departureTime",
                                e.target.value,
                              )
                            }
                            className="h-9 text-sm text-center"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRouteStop(index)}
                          className="w-10 p-0"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Select
                  value=""
                  onValueChange={(v) => {
                    addRouteStop(v);
                  }}
                >
                  <SelectTrigger className="mt-3">
                    <SelectValue placeholder="+ Add station to route" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations
                      .filter(
                        (s) => !formData.route.some((r) => r.station === s.id),
                      )
                      .map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name} ({station.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData((p) => ({
                    ...p,
                    status: v as "ACTIVE" | "INACTIVE",
                  }))
                }
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingSchedule ? "Save Changes" : "Add Schedule"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};
