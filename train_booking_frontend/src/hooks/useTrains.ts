import { useState, useCallback, useEffect } from "react";
import { Train } from "@/types/train";
import { trainService } from "@/services/trainService";
import { useToast } from "./use-toast";

export const useTrains = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTrains = useCallback(async () => {
    setLoading(true);
    try {
      const data = await trainService.getAllTrains();
      setTrains(data);
    } catch (error: any) {
      toast({
        title: "Error fetching trains",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  const addTrain = useCallback(
    async (train: Omit<Train, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newTrain = await trainService.createTrain(train);
        setTrains((prev) => [...prev, newTrain]);
        toast({
          title: "Train Added",
          description: `${newTrain.name} created successfully`,
        });
        return newTrain;
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

  const updateTrain = useCallback(
    async (id: string, data: Partial<Train>) => {
      try {
        const updated = await trainService.updateTrain(id, data);
        setTrains((prev) => prev.map((t) => (t.id === id ? updated : t)));
        toast({ title: "Train Updated" });
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

  const deleteTrain = useCallback(
    async (id: string) => {
      try {
        await trainService.deleteTrain(id);
        setTrains((prev) => prev.filter((t) => t.id !== id));
        toast({ title: "Train Deleted" });
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

  const toggleTrainStatus = useCallback(
    async (id: string) => {
      try {
        const updated = await trainService.toggleTrainStatus(id);
        setTrains((prev) => prev.map((t) => (t.id === id ? updated : t)));
        toast({ title: "Status Toggled" });
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
    trains,
    loading,
    fetchTrains,
    addTrain,
    updateTrain,
    deleteTrain,
    toggleTrainStatus,
  };
};
