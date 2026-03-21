import { useState, useCallback, useMemo, useEffect } from 'react';
import { Seat, CoachWithSeats } from '@/types/seat';
import { BookedSeat } from '@/types/booking';
import { Price } from '@/types/price';
import { seatService } from '@/services/seatService';
import { priceService } from '@/services/priceService';
import { useToast } from './use-toast';

export const useSeatSelection = (_trainId: string, scheduleId: string, date: string) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [activeCoachId, setActiveCoachId] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<CoachWithSeats[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(() => {
    if (!scheduleId || !date) return;
    setIsLoading(true);
    try {
      const seatData = seatService.getSeatLayout(scheduleId, date);
      const priceData = priceService.getPricesBySchedule(scheduleId);

      const normalizedCoaches = seatData.coaches.map((coach: any) => ({
        ...coach,
        id: coach.coachId,
        name: coach.coachName,
        seats: coach.seats.map((seat: any) => ({
          ...seat,
          id: seat._id || seat.id,
        })),
      }));

      setCoaches(normalizedCoaches);
      setPrices(priceData);
      
      if (normalizedCoaches.length > 0 && !activeCoachId) {
        setActiveCoachId(normalizedCoaches[0].id);
      }
    } catch (error: any) {
      toast({
        title: 'Error loading seats',
        description: error.message || 'Could not fetch seat layout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId, date, activeCoachId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeCoach = useMemo(() => {
    if (!activeCoachId && coaches.length > 0) {
      return coaches[0];
    }
    return coaches.find(c => c.id === activeCoachId) || null;
  }, [activeCoachId, coaches]);

  const toggleSeatSelection = useCallback((seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'unavailable') {
      return;
    }

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const getSeatPrice = useCallback((classType: '1ST' | '2ND' | '3RD'): number => {
    const price = prices.find(p => p.classType === classType);
    return price?.basePrice ?? 0;
  }, [prices]);

  const getSelectedSeatsAsBookedSeats = useCallback((): BookedSeat[] => {
    return selectedSeats.map(seat => {
      const coach = coaches.find(c => c.id === seat.coachId);
      return {
        seatId: seat.id,
        coachId: seat.coachId,
        seatNumber: seat.seatNumber,
        coachName: coach?.name || '',
        classType: seat.classType,
        price: getSeatPrice(seat.classType),
      };
    });
  }, [selectedSeats, coaches, getSeatPrice]);

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat.classType), 0);
  }, [selectedSeats, getSeatPrice]);

  const availableSeatsCount = useMemo(() => {
    return coaches.reduce((acc, coach) => {
      const available = coach.seats.filter(s => s.status === 'available').length;
      acc[coach.classType] = (acc[coach.classType] || 0) + available;
      return acc;
    }, {} as Record<string, number>);
  }, [coaches]);

  return {
    coaches,
    prices,
    activeCoach,
    activeCoachId,
    selectedSeats,
    totalAmount,
    availableSeatsCount,
    isLoading,
    setActiveCoachId,
    toggleSeatSelection,
    clearSelection,
    getSeatPrice,
    getSelectedSeatsAsBookedSeats,
    refreshData: fetchData,
  };
};