import { useState, useCallback, useMemo, useEffect } from "react";
import { Train } from "@/types/train";
import { Schedule, ScheduleFormData } from "@/types/schedule";
import { Price } from "@/types/price";
import { Coach } from "@/types/seat";
import { Booking } from "@/types/booking";
import { User } from "@/types/user";
import { scheduleService } from "@/services/scheduleService";
import { priceService } from "@/services/priceService";
import { bookingService } from "@/services/bookingService";
import { userService } from "@/services/userService";
import { stationService } from "@/services/stationService";
import { trainService } from "@/services/trainService";
import { seatService, CoachPayload } from "@/services/seatService";
import {
  getBookingStats,
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let schedulesData: Schedule[] = [];
      let pricesData: Price[] = [];
      let bookingsData: Booking[] = [];
      let usersData: User[] = [];
      let stationsData: any[] = [];
      let trainsData: Train[] = [];

      try {
        trainsData = await trainService.getAllTrains();
      } catch (e) {
        console.warn('Failed to fetch trains:', e);
      }

      try {
        stationsData = await stationService.getAllStations();
      } catch (e) {
        console.warn('Failed to fetch stations:', e);
      }

      try {
        schedulesData = await scheduleService.getAllSchedules(trainsData, stationsData) || [];
      } catch (e) {
        console.warn('Failed to fetch schedules:', e);
      }

      try {
        pricesData = await priceService.getAllPrices();
      } catch (e) {
        console.warn('Failed to fetch prices:', e);
      }

      try {
        bookingsData = await bookingService.getAllBookings() || [];
      } catch (e) {
        console.warn('Failed to fetch bookings:', e);
      }

      try {
        usersData = await userService.getAllUsers() || [];
      } catch (e) {
        console.warn('Failed to fetch users:', e);
      }

      let coachesData: any[] = [];
      try {
        coachesData = await seatService.getAllCoaches();
      } catch (e) {
        console.warn('Failed to fetch coaches:', e);
      }

      setSchedules(schedulesData);
      setPrices(pricesData);
      setCoaches(coachesData);
      setBookings(bookingsData);
      setUsers(usersData);
      setStations(stationsData);
      setTrains(trainsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dashboardStats = useMemo(
    () => ({
      bookings: getBookingStats(bookings),
      trains: { total: trains.length, active: trains.filter(t => t.isActive).length, inactive: trains.filter(t => !t.isActive).length },
      schedules: getScheduleStats(schedules),
      seats: getSeatStats(coaches),
    }),
    [bookings, trains, schedules, coaches],
  );

  const addSchedule = useCallback(
    async (schedule: ScheduleFormData) => {
      try {
        const newSchedule = await scheduleService.createSchedule(schedule);
        setSchedules((prev) => [...prev, newSchedule]);
        toast({ title: "Schedule Added" });
        return newSchedule;
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

  const updateSchedule = useCallback(
    async (id: string, data: Partial<ScheduleFormData>) => {
      try {
        const updated = await scheduleService.updateSchedule(id, data);
        setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
        toast({ title: "Schedule Updated" });
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

  const deleteSchedule = useCallback(
    async (id: string) => {
      try {
        await scheduleService.deleteSchedule(id);
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        toast({ title: "Schedule Deleted" });
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
    async (id: string, data: Partial<Price>) => {
      try {
        const updated = await priceService.updatePrice(id, data);
        setPrices((prev) => prev.map((item) => (item.id === id ? updated : item)));
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

  const getPricesForSchedule = useCallback(
    (scheduleId: string): Price[] => {
      return prices.filter((p) => p.schedule === scheduleId);
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

  const addCoach = useCallback(
    async (coachData: CoachPayload) => {
      try {
        const newCoach = await seatService.createCoach(coachData);
        setCoaches((prev) => [...prev, newCoach]);
        toast({ title: "Coach Added" });
        return newCoach;
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

  const updateCoach = useCallback(
    async (id: string, data: Partial<CoachPayload>) => {
      try {
        const updated = await seatService.updateCoach(id, data);
        setCoaches((prev) => prev.map((c) => (c.id === id ? updated : c)));
        toast({ title: "Coach Updated" });
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

  const deleteCoach = useCallback(
    async (id: string) => {
      try {
        await seatService.deleteCoach(id);
        setCoaches((prev) => prev.filter((c) => c.id !== id));
        toast({ title: "Coach Deleted" });
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
    schedules,
    prices,
    coaches,
    bookings,
    users,
    stations,
    loading,
    dashboardStats,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    updatePrice,
    getPricesForSchedule,
    toggleUserStatus,
    deleteUser,
    addCoach,
    updateCoach,
    deleteCoach,
    refreshData: fetchData,
  };
};