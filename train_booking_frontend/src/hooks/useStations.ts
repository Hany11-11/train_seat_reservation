import { useState, useCallback, useEffect } from "react";
import { Station } from "@/types/schedule";
import { stationService } from "@/services/stationService";
import { useToast } from "./use-toast";

export const useStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await stationService.getAllStations();
      setStations(data);
    } catch (error: any) {
      toast({
        title: "Error fetching stations",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const addStation = useCallback(
    async (station: Omit<Station, "id">) => {
      try {
        const newStation = await stationService.createStation(station);
        setStations((prev) => [...prev, newStation]);
        toast({
          title: "Station Added",
          description: `${newStation.name} created successfully`,
        });
        return newStation;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const updateStation = useCallback(
    async (id: string, data: Partial<Station>) => {
      try {
        const updated = await stationService.updateStation(id, data);
        setStations((prev) => prev.map((s) => (s.id === id ? updated : s)));
        toast({ title: "Station Updated" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const deleteStation = useCallback(
    async (id: string) => {
      try {
        await stationService.deleteStation(id);
        setStations((prev) => prev.filter((s) => s.id !== id));
        toast({ title: "Station Deleted" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  return {
    stations,
    loading,
    fetchStations,
    addStation,
    updateStation,
    deleteStation,
  };
};
