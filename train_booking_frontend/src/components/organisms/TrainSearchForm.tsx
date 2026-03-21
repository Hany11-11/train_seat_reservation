import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/atoms/Input';
import { STATIONS } from '@/types/schedule';

interface TrainSearchFormProps {
  onSearch: (params: {
    fromStationId: string;
    toStationId: string;
    date: string;
    passengers: number;
  }) => void;
}

export const TrainSearchForm = ({ onSearch }: TrainSearchFormProps) => {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const today = new Date().toISOString().split('T')[0];

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

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* From Station */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-primary" />
            From
          </Label>
          <Select value={fromStation} onValueChange={setFromStation}>
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {STATIONS.map(station => (
                <SelectItem 
                  key={station.id} 
                  value={station.id}
                  disabled={station.id === toStation}
                >
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="hidden lg:flex justify-center pb-2">
          <button
            type="button"
            onClick={handleSwapStations}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* To Station */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-accent" />
            To
          </Label>
          <Select value={toStation} onValueChange={setToStation}>
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {STATIONS.map(station => (
                <SelectItem 
                  key={station.id} 
                  value={station.id}
                  disabled={station.id === fromStation}
                >
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            Date
          </Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
          />
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Users className="w-4 h-4 text-primary" />
            Passengers
          </Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <Button 
          type="submit" 
          className="w-full md:w-auto px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          disabled={!fromStation || !toStation || !date}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Trains
        </Button>
      </div>
    </form>
  );
};
