import { useState, useCallback } from "react";
import {
  Booking,
  BookingSearchResult,
  PassengerDetails,
  BookedSeat,
} from "@/types/booking";
import { scheduleService } from "@/services/scheduleService";
import { bookingService } from "@/services/bookingService";
import { formatDuration } from "@/utils/fareCalculator";
import { useToast } from "./use-toast";

export interface SearchParams {
  fromStationId: string;
  toStationId: string;
  date: string;
  passengers: number;
}

export const useBooking = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<BookingSearchResult[]>([]);
  const [selectedResult, setSelectedResult] =
    useState<BookingSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchTrains = useCallback(
    (params: SearchParams): BookingSearchResult[] => {
      setIsSearching(true);
      setSearchParams(params);

      try {
        const data = scheduleService.searchSchedules({
          from: params.fromStationId,
          to: params.toStationId,
          date: params.date,
        } as any);

        const results: BookingSearchResult[] = data.map((s: any) => ({
          scheduleId: s.scheduleId,
          trainId: s.trainId,
          trainNumber: s.trainNumber,
          trainName: s.trainName,
          fromStation: s.fromStation,
          toStation: s.toStation,
          departureTime: s.departureTime,
          arrivalTime: s.arrivalTime,
          duration: formatDuration(s.durationMinutes),
          date: s.date,
          availability: s.availability.map((a: any) => ({
            classType: a.classType,
            className:
              a.classType === "1ST"
                ? "First Class"
                : a.classType === "2ND"
                  ? "Second Class"
                  : "Third Class",
            availableSeats: a.availableSeats,
            totalSeats: a.totalSeats || 0,
            price: a.price,
          })),
        }));

        setSearchResults(results);
        return results;
      } catch (error: any) {
        toast({
          title: "Search Failed",
          description: error.message || "Failed to search trains",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    [toast],
  );

  const createBooking = useCallback(
    (
      _userId: string,
      scheduleId: string,
      trainId: string,
      travelDate: string,
      seats: BookedSeat[],
      passengerDetails: PassengerDetails,
    ): Booking | null => {
      try {
        const booking = bookingService.createBooking({
          scheduleId,
          trainId,
          travelDate,
          seats,
          passengerDetails,
        });

        toast({
          title: "Booking Successful",
          description: `Your booking ref: ${booking.referenceNumber} is confirmed.`,
        });

        return booking;
      } catch (error: any) {
        toast({
          title: "Booking Failed",
          description: error.message || "Failed to create booking",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  const getUserBookings = useCallback((): Booking[] => {
    try {
      return bookingService.getMyBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch your bookings",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const cancelBooking = useCallback(
    (bookingId: string): boolean => {
      try {
        bookingService.cancelBooking(bookingId);
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been successfully cancelled.",
        });
        return true;
      } catch (error: any) {
        toast({
          title: "Cancellation Failed",
          description: error.message || "Failed to cancel booking",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast],
  );

  return {
    searchParams,
    searchResults,
    selectedResult,
    isSearching,
    setSelectedResult,
    searchTrains,
    createBooking,
    getUserBookings,
    cancelBooking,
  };
};