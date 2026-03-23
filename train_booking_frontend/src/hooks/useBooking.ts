import { useState, useCallback } from "react";
import {
  Booking,
  BookingSearchResult,
  PassengerDetails,
  BookedSeat,
} from "@/types/booking";
import { scheduleService, SearchTrainResult } from "@/services/scheduleService";
import { bookingService } from "@/services/bookingService";
import { useToast } from "./use-toast";

export interface SearchParams {
  fromStationId: string;
  toStationId: string;
  date: string;
  passengers: number;
}

const mapSearchResultToBookingSearchResult = (
  result: SearchTrainResult,
  date: string,
  passengers: number
): BookingSearchResult => ({
  scheduleId: result.scheduleId,
  trainId: result.trainId,
  trainNumber: result.trainNumber,
  trainName: result.trainName,
  fromStation: {
    id: result.fromStation.id,
    name: result.fromStation.name,
    code: result.fromStation.code,
  },
  toStation: {
    id: result.toStation.id,
    name: result.toStation.name,
    code: result.toStation.code,
  },
  departureTime: result.departureTime,
  arrivalTime: result.arrivalTime,
  duration: result.duration,
  date,
  passengers,
  fromStationRoute: result.fromStationRoute,
  toStationRoute: result.toStationRoute,
  userDuration: result.userDuration,
  availability: result.availability,
  prices: Object.fromEntries(
    Object.entries(result.prices).map(([key, value]) => [key, value.price])
  ) as Record<string, number>,
  classTypes: result.classTypes,
  route: result.route,
});

export const useBooking = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [searchResults, setSearchResults] = useState<BookingSearchResult[]>([]);
  const [selectedResult, setSelectedResult] =
    useState<BookingSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchTrains = useCallback(
    async (params: SearchParams): Promise<BookingSearchResult[]> => {
      setIsSearching(true);
      setSearchParams(params);

      try {
        const searchResults = await scheduleService.searchTrains(
          params.fromStationId,
          params.toStationId
        );

        const results = searchResults.map((result) =>
          mapSearchResultToBookingSearchResult(result, params.date, params.passengers)
        );

        setSearchResults(results);
        return results;
      } catch (error: any) {
        toast({
          title: "Search Failed",
          description: error.response?.data?.error || error.message || "Failed to search trains",
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
    async (
      scheduleId: string,
      trainId: string,
      fromStationId: string,
      toStationId: string,
      travelDate: string,
      seats: BookedSeat[],
      passengerDetails: PassengerDetails,
    ): Promise<Booking | null> => {
      try {
        const booking = await bookingService.createBooking({
          scheduleId,
          trainId,
          fromStationId,
          toStationId,
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
          description: error.response?.data?.error || error.message || "Failed to create booking",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  const getUserBookings = useCallback(async (): Promise<Booking[]> => {
    try {
      return await bookingService.getMyBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch your bookings",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const cancelBooking = useCallback(
    async (bookingId: string): Promise<boolean> => {
      try {
        await bookingService.cancelBooking(bookingId);
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been successfully cancelled.",
        });
        return true;
      } catch (error: any) {
        toast({
          title: "Cancellation Failed",
          description: error.response?.data?.error || error.message || "Failed to cancel booking",
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
