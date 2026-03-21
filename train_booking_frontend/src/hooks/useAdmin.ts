import { useState, useCallback, useMemo, useEffect } from "react";
import { Train } from "@/types/train";
import { Schedule } from "@/types/schedule";
import { Price } from "@/types/price";
import { Coach } from "@/types/seat";
import { Booking } from "@/types/booking";
import { User } from "@/types/user";
import { trainService } from "@/services/trainService";
import { scheduleService } from "@/services/scheduleService";
import { priceService } from "@/services/priceService";
import { seatService } from "@/services/seatService";
import { bookingService } from "@/services/bookingService";
import { userService } from "@/services/userService";
import { stationService } from "@/services/stationService";
import {
  getBookingStats,
  getTrainStats,
  getScheduleStats,
  getSeatStats,
} from "@/utils/adminHelpers";
import { useToast } from "./use-toast";

export const useAdmin = () => {
  const [trains, setTrains] = useState<Train[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(() => {
    setLoading(true);
    try {
      const t = trainService.getAllTrains();
      const s = scheduleService.getAllSchedules();
      const p = priceService.getAllPrices();
      const b = bookingService.getAllBookings();
      const u = userService.getAllUsers();
      const st = stationService.getAllStations();

      const allCoaches: Coach[] = t.flatMap((train: any) =>
        (train.coaches || []).map((c: any) => ({
          ...c,
          id: c._id || c.id,
          trainId: train.id,
        })),
      );

      setTrains(t);
      setSchedules(s);
      setPrices(p);
      setCoaches(allCoaches);
      setBookings(b);
      setUsers(u);
      setStations(st);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dashboardStats = useMemo(
    () => ({
      bookings: getBookingStats(bookings),
      trains: getTrainStats(trains),
      schedules: getScheduleStats(schedules),
      seats: getSeatStats(coaches),
    }),
    [bookings, trains, schedules, coaches],
  );

  const addTrain = useCallback(
    (train: Omit<Train, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newTrain = trainService.createTrain(train);
        setTrains((prev) => [...prev, newTrain]);
        toast({
          title: "Train Added",
          description: `${newTrain.name} created successfully`,
        });
        return newTrain;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const updateTrain = useCallback(
    (id: string, data: Partial<Train>) => {
      try {
        const updated = trainService.updateTrain(id, data);
        setTrains((prev) => prev.map((t) => (t.id === id ? updated : t)));
        toast({ title: "Train Updated" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const deleteTrain = useCallback(
    (id: string) => {
      try {
        trainService.deleteTrain(id);
        setTrains((prev) => prev.filter((t) => t.id !== id));
        toast({ title: "Train Deleted" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const toggleTrainStatus = useCallback(
    (id: string) => {
      try {
        const updated = trainService.toggleTrainStatus(id);
        setTrains((prev) => prev.map((t) => (t.id === id ? updated : t)));
        toast({ title: "Status Toggled" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const addSchedule = useCallback(
    (schedule: Omit<Schedule, "id">) => {
      try {
        const newSchedule = scheduleService.createSchedule(schedule);
        setSchedules((prev) => [...prev, newSchedule]);
        const updatedPrices = priceService.getAllPrices();
        setPrices(updatedPrices);
        toast({ title: "Schedule Added" });
        return newSchedule;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const updateSchedule = useCallback(
    (id: string, data: Partial<Schedule>) => {
      try {
        const updated = scheduleService.updateSchedule(id, data);
        setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
        toast({ title: "Schedule Updated" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const deleteSchedule = useCallback(
    (id: string) => {
      try {
        scheduleService.deleteSchedule(id);
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        toast({ title: "Schedule Deleted" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const updatePrice = useCallback(
    (id: string, data: Partial<Price>) => {
      try {
        const p = prices.find((x) => x.id === id);
        if (!p) return;
        const updated = priceService.setPrice({
          scheduleId: p.scheduleId,
          classType: p.classType,
          basePrice: data.basePrice ?? p.basePrice,
          currency: data.currency ?? p.currency,
          isActive: data.isActive ?? p.isActive,
        });
        setPrices((prev) =>
          prev.map((item) => (item.id === id ? updated : item)),
        );
        toast({ title: "Price Updated" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast, prices],
  );

  const getPricesForSchedule = useCallback(
    (scheduleId: string): Price[] => {
      return prices.filter((p) => p.scheduleId === scheduleId);
    },
    [prices],
  );

  const toggleUserStatus = useCallback(
    (id: string) => {
      try {
        const updated = userService.toggleUserStatus(id);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        toast({ title: "User Status Toggled" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  const deleteUser = useCallback(
    (id: string) => {
      try {
        userService.deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast({ title: "User Deleted" });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  return {
    trains,
    schedules,
    prices,
    coaches,
    bookings,
    users,
    stations,
    loading,
    dashboardStats,
    addTrain,
    updateTrain,
    deleteTrain,
    toggleTrainStatus,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    updatePrice,
    getPricesForSchedule,
    toggleUserStatus,
    deleteUser,
    refreshData: fetchData,
  };
};