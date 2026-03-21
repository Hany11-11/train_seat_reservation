import { useState } from "react";
import { Coach } from "@/types/seat";
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
import { Plus, Pencil, Trash2, Armchair } from "lucide-react";

interface AdminSeatEditorProps {
  coaches: Coach[];
  trains: Train[];
  onAdd: (coach: Omit<Coach, "id">) => void;
  onUpdate: (id: string, data: Partial<Coach>) => void;
  onDelete: (id: string) => void;
}

export const AdminSeatEditor = ({
  coaches,
  trains,
  onAdd,
  onUpdate,
  onDelete,
}: AdminSeatEditorProps) => {
  const [search, setSearch] = useState("");
  const [selectedTrainId, setSelectedTrainId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState({
    trainId: "",
    name: "",
    classType: "" as "1ST" | "2ND" | "3RD" | "",
    totalSeats: 48,
    seatsPerRow: 4,
    totalRows: 12,
    layout: "2-2",
  });

  const getTrainName = (trainId: string) =>
    trains.find((t) => t.id === trainId)?.name || trainId;

  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case "1ST":
        return "class1st";
      case "2ND":
        return "class2nd";
      case "3RD":
        return "class3rd";
      default:
        return "secondary";
    }
  };

  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      coach.name.toLowerCase().includes(search.toLowerCase()) ||
      getTrainName(coach.trainId).toLowerCase().includes(search.toLowerCase());
    const matchesTrain =
      selectedTrainId === "all" || coach.trainId === selectedTrainId;
    return matchesSearch && matchesTrain;
  });

  const handleOpenModal = (coach?: Coach) => {
    if (coach) {
      setEditingCoach(coach);
      setFormData({
        trainId: coach.trainId,
        name: coach.name,
        classType: coach.classType,
        totalSeats: coach.totalSeats,
        seatsPerRow: coach.seatsPerRow,
        totalRows: coach.totalRows,
        layout: coach.layout,
      });
    } else {
      setEditingCoach(null);
      setFormData({
        trainId: selectedTrainId === "all" ? "" : selectedTrainId,
        name: "",
        classType: "",
        totalSeats: 48,
        seatsPerRow: 4,
        totalRows: 12,
        layout: "2-2",
      });
    }
    setIsModalOpen(true);
  };

  const handleClassChange = (classType: "1ST" | "2ND" | "3RD") => {
    let seatsPerRow = 4;
    let layout = "2-2";
    let totalRows = 12;
    let totalSeats = 48;

    if (classType === "1ST") {
      seatsPerRow = 4;
      layout = "2-2";
      totalRows = 6;
      totalSeats = 24;
    } else if (classType === "2ND") {
      seatsPerRow = 4;
      layout = "2-2";
      totalRows = 12;
      totalSeats = 48;
    } else if (classType === "3RD") {
      seatsPerRow = 6;
      layout = "3-3";
      totalRows = 12;
      totalSeats = 72;
    }

    setFormData((prev) => ({
      ...prev,
      classType,
      seatsPerRow,
      layout,
      totalRows,
      totalSeats,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classType) return;

    const coachData = {
      ...formData,
      classType: formData.classType as "1ST" | "2ND" | "3RD",
    };

    if (editingCoach) {
      onUpdate(editingCoach.id, coachData);
    } else {
      onAdd(coachData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search coaches..."
            className="flex-1 sm:max-w-64"
          />
          <Select value={selectedTrainId} onValueChange={setSelectedTrainId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Trains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trains</SelectItem>
              {trains &&
                trains.map((train) => (
                  <SelectItem key={train.id} value={train.id}>
                    {train.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coach
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coach</TableHead>
              <TableHead>Train</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Layout</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoaches.map((coach) => (
              <TableRow key={coach.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Armchair className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{coach.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getTrainName(coach.trainId)}
                </TableCell>
                <TableCell>
                  <Badge variant={getClassBadgeVariant(coach.classType)}>
                    {coach.classType === "1ST"
                      ? "First"
                      : coach.classType === "2ND"
                        ? "Second"
                        : "Third"}{" "}
                    Class
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {coach.layout}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {coach.totalSeats} ({coach.totalRows} rows ×{" "}
                  {coach.seatsPerRow})
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(coach)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coach.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCoaches.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No coaches found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content className="max-w-md">
          <Modal.Header>
            <Modal.Title>
              {editingCoach ? "Edit Coach" : "Add New Coach"}
            </Modal.Title>
            <Modal.Description>
              {editingCoach
                ? "Update the coach configuration."
                : "Configure a new coach for a train."}
            </Modal.Description>
          </Modal.Header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Train</Label>
              <Select
                value={formData.trainId}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, trainId: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select train" />
                </SelectTrigger>
                <SelectContent>
                  {trains &&
                    trains.map((train) => (
                      <SelectItem key={train.id} value={train.id}>
                        {train.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coachName">Coach Name</Label>
                <Input
                  id="coachName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g., A1, B1, C1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Class Type</Label>
                <Select
                  value={formData.classType}
                  onValueChange={(v) =>
                    handleClassChange(v as "1ST" | "2ND" | "3RD")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ST">First Class</SelectItem>
                    <SelectItem value="2ND">Second Class</SelectItem>
                    <SelectItem value="3RD">Third Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalRows">Rows</Label>
                <Input
                  id="totalRows"
                  type="number"
                  min="1"
                  value={formData.totalRows}
                  onChange={(e) => {
                    const rows = parseInt(e.target.value) || 0;
                    setFormData((p) => ({
                      ...p,
                      totalRows: rows,
                      totalSeats: rows * p.seatsPerRow,
                    }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seatsPerRow">Seats/Row</Label>
                <Input
                  id="seatsPerRow"
                  type="number"
                  min="2"
                  max="8"
                  value={formData.seatsPerRow}
                  onChange={(e) => {
                    const seats = parseInt(e.target.value) || 0;
                    const half = Math.floor(seats / 2);
                    setFormData((p) => ({
                      ...p,
                      seatsPerRow: seats,
                      totalSeats: p.totalRows * seats,
                      layout: `${half}-${seats - half}`,
                    }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Layout</Label>
                <Input
                  id="layout"
                  value={formData.layout}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, layout: e.target.value }))
                  }
                  placeholder="2-2"
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Total Seats:{" "}
              <span className="font-medium">{formData.totalSeats}</span>
            </p>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.classType || !formData.trainId}
              >
                {editingCoach ? "Save Changes" : "Add Coach"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};
