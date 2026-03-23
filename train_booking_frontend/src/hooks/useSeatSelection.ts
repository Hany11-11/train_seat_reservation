import { useState, useCallback, useMemo, useEffect } from 'react';
import { BookedSeat } from '@/types/booking';
import { seatService, CoachWithSeats, SeatAvailability } from '@/services/seatService';
import { useToast } from './use-toast';

export const useSeatSelection = (scheduleId: string, date: string, classType: string, ticketPrice: number) => {
  const [selectedSeats, setSelectedSeats] = useState<SeatAvailability[]>([]);
  const [activeCoachId, setActiveCoachId] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<CoachWithSeats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!scheduleId || !date || !classType) return;
    setIsLoading(true);
    try {
      const availabilityData = await seatService.getSeatAvailability(scheduleId, date, classType);
      
      if (availabilityData.success && availabilityData.data) {
        setCoaches(availabilityData.data);
        
        if (availabilityData.data.length > 0 && !activeCoachId) {
          setActiveCoachId(availabilityData.data[0].coachId);
        }
      } else {
        setCoaches([]);
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
  }, [scheduleId, date, classType, activeCoachId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeCoach = useMemo(() => {
    if (!activeCoachId && coaches.length > 0) {
      return coaches[0];
    }
    return coaches.find(c => c.coachId === activeCoachId) || null;
  }, [activeCoachId, coaches]);

  const toggleSeatSelection = useCallback((seat: SeatAvailability) => {
    if (seat.status === 'booked' || seat.status === 'unavailable') {
      return;
    }

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s._id === seat._id);
      if (isSelected) {
        return prev.filter(s => s._id !== seat._id);
      }
      return [...prev, seat];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const getSelectedSeatsAsBookedSeats = useCallback((): BookedSeat[] => {
    return selectedSeats.map(seat => {
      return {
        seatId: seat._id,
        coachId: seat.coachId,
        seatNumber: seat.seatNumber,
        coachName: seat.coachName,
        classType: seat.classType as '1ST' | '2ND' | '3RD',
        price: ticketPrice,
      };
    });
  }, [selectedSeats, ticketPrice]);

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum) => sum + ticketPrice, 0);
  }, [selectedSeats, ticketPrice]);

  const availableSeatsCount = useMemo(() => {
    return coaches.reduce((acc, coach) => {
      acc[coach.coachId] = coach.availableSeats;
      return acc;
    }, {} as Record<string, number>);
  }, [coaches]);

  return {
    coaches,
    activeCoach,
    activeCoachId,
    selectedSeats,
    totalAmount,
    availableSeatsCount,
    isLoading,
    setActiveCoachId,
    toggleSeatSelection,
    clearSelection,
    getSelectedSeatsAsBookedSeats,
    refreshData: fetchData,
  };
};