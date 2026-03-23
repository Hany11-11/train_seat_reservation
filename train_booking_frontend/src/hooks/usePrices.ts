import { useState, useCallback, useEffect } from "react";
import { Price, PriceFormData } from "@/types/price";
import { priceService } from "@/services/priceService";
import { useToast } from "./use-toast";

export const usePrices = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await priceService.getAllPrices();
      setPrices(data);
    } catch (error: any) {
      toast({
        title: "Error fetching prices",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const addPrice = useCallback(
    async (priceData: PriceFormData) => {
      try {
        const newPrice = await priceService.createPrice(priceData);
        setPrices((prev) => [...prev, newPrice]);
        toast({
          title: "Price Added",
          description: `Price created successfully`,
        });
        return newPrice;
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

  const updatePrice = useCallback(
    async (id: string, data: Partial<PriceFormData>) => {
      try {
        const updated = await priceService.updatePrice(id, data);
        setPrices((prev) => prev.map((p) => (p.id === id ? updated : p)));
        toast({ title: "Price Updated" });
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

  const deletePrice = useCallback(
    async (id: string) => {
      try {
        await priceService.deletePrice(id);
        setPrices((prev) => prev.filter((p) => p.id !== id));
        toast({ title: "Price Deleted" });
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

  const getPricesForSchedule = useCallback(
    (scheduleId: string): Price[] => {
      return prices.filter((p) => p.schedule === scheduleId);
    },
    [prices],
  );

  return {
    prices,
    loading,
    fetchPrices,
    addPrice,
    updatePrice,
    deletePrice,
    getPricesForSchedule,
  };
};
