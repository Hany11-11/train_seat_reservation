import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { Input } from "@/components/atoms/Input";
import { Station } from "@/types/schedule";
import { Search } from "lucide-react";

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  stations: Station[];
  excludeId?: string;
  placeholder?: string;
  label: string;
  icon?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export const SearchableSelect = ({
  value,
  onValueChange,
  stations,
  excludeId,
  placeholder = "Choose station",
  label,
  icon,
  onOpenChange,
}: SearchableSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredStations = stations
    .filter(
      (station) =>
        station.id !== excludeId &&
        (station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.code.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (searchTerm) {
      setSearchTerm("");
    }
  }, [value]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    } else {
      setSearchTerm("");
    }
    onOpenChange?.(open);
  };

  return (
    <div ref={containerRef}>
      <Select value={value} onValueChange={onValueChange} onOpenChange={handleOpenChange}>
        <SelectTrigger className="w-full h-11 bg-background/50">
          <SelectValue placeholder="Choose station" />
        </SelectTrigger>
        <SelectContent side="bottom">
          <div className="flex items-center px-2 pb-2">
            <Search className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input
              ref={searchRef}
              placeholder="Search station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm border-0 focus-visible:ring-0 p-0"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {filteredStations.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              No stations found
            </div>
          ) : (
            filteredStations.map((station) => (
              <SelectItem key={station.id} value={station.id}>
                <div className="flex flex-col">
                  <span>{station.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {station.city} ({station.code})
                  </span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
