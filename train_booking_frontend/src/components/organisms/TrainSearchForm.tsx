import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Users,
  MapPin,
  ArrowRightLeft,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/atoms/Input";
import { useStations } from "@/hooks/useStations";
import { SearchableSelect } from "@/components/molecules/SearchableSelect";
import { DatePicker } from "@/components/molecules/DatePicker";

interface TrainSearchFormProps {
  onSearch: (params: {
    fromStationId: string;
    toStationId: string;
    date: string;
    passengers: number;
  }) => void;
  initialValues?: {
    fromStationId?: string;
    toStationId?: string;
    date?: string;
    passengers?: number;
  };
}

export const TrainSearchForm = ({
  onSearch,
  initialValues,
}: TrainSearchFormProps) => {
  const [fromStation, setFromStation] = useState(
    initialValues?.fromStationId || "",
  );
  const [toStation, setToStation] = useState(initialValues?.toStationId || "");
  const [date, setDate] = useState(initialValues?.date || "");
  const [passengers, setPassengers] = useState(
    initialValues?.passengers?.toString() || "1",
  );
  const { stations, loading } = useStations();

  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromStation && toStation && date) {
      onSearch({
        fromStationId: fromStation,
        toStationId: toStation,
        date,
        passengers: parseInt(passengers, 10),
      });
    }
  };

  const handleReset = () => {
    setFromStation("");
    setToStation("");
    setDate("");
    setPassengers("1");
  };

  // Smooth scroll when station select is opened
  const handleStationSelectOpen = (open: boolean) => {
    if (open && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl border border-border p-6 shadow-lg max-w-5xl mx-auto"
    >
      <div className="space-y-4">
        {/* Row 1: From, To, Date */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          {/* From */}
          <div className="flex-1 w-full space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary" />
              From
            </Label>
            <SearchableSelect
              value={fromStation}
              onValueChange={setFromStation}
              stations={stations}
              excludeId={toStation}
              placeholder="Choose station"
              label="From"
              onOpenChange={handleStationSelectOpen}
            />
          </div>

          {/* Swap */}
          <button
            type="button"
            onClick={handleSwapStations}
            className="shrink-0 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* To */}
          <div className="flex-1 w-full space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="w-3 h-3 text-accent" />
              To
            </Label>
            <SearchableSelect
              value={toStation}
              onValueChange={setToStation}
              stations={stations}
              excludeId={fromStation}
              placeholder="Choose station"
              label="To"
              onOpenChange={handleStationSelectOpen}
            />
          </div>

          {/* Date */}
          <div className="w-full sm:w-44 space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="w-3 h-3 text-primary" />
              Date
            </Label>
            <DatePicker
              value={date}
              onChange={setDate}
              minDate={today}
              placeholder="Select date"
            />
          </div>
        </div>

        {/* Row 2: Under From - Passengers */}
        <div className="w-full sm:w-48 space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="w-3 h-3 text-primary" />
            Passengers
          </Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="w-full h-11 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Buttons Row */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="h-11 border-primary/30 text-primary hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            type="submit"
            className="h-11 bg-accent hover:bg-accent/90 font-semibold"
            disabled={!fromStation || !toStation || !date}
          >
            <Search className="w-4 h-4 mr-2" />
            Search Trains
          </Button>
        </div>
      </div>
    </form>
  );
};
