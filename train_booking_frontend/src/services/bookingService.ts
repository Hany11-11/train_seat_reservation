import { Booking, PassengerDetails, BookedSeat } from "@/types/booking";
import {
  getBookingsFromStorage,
  saveBookingsToStorage,
  getBookingsForUser,
  generateBookingReference,
} from "@/data/bookings.mock";

type BookingStats = {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
};

const getCurrentUserId = (): string => {
  const user = localStorage.getItem("current_user");
  if (user) {
    return JSON.parse(user).id;
  }
  throw new Error("Not authenticated");
};

export const bookingService = {
  createBooking(payload: {
    scheduleId: string;
    trainId: string;
    travelDate: string;
    seats: BookedSeat[];
    passengerDetails: PassengerDetails;
  }): Booking {
    const userId = getCurrentUserId();
    const bookings = getBookingsFromStorage();

    const totalAmount = payload.seats.reduce(
      (sum, seat) => sum + seat.price,
      0,
    );

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      referenceNumber: generateBookingReference(),
      userId,
      scheduleId: payload.scheduleId,
      trainId: payload.trainId,
      travelDate: payload.travelDate,
      seats: payload.seats,
      totalAmount,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      passengerDetails: payload.passengerDetails,
    };

    bookings.push(newBooking);
    saveBookingsToStorage(bookings);

    return newBooking;
  },

  getMyBookings(): Booking[] {
    const userId = getCurrentUserId();
    return getBookingsForUser(userId);
  },

  getBookingById(id: string): Booking {
    const bookings = getBookingsFromStorage();
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  },

  cancelBooking(id: string): Booking {
    const bookings = getBookingsFromStorage();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error("Booking not found");
    }

    bookings[index].status = "cancelled";
    saveBookingsToStorage(bookings);

    return bookings[index];
  },

  getAllBookings(): Booking[] {
    return getBookingsFromStorage();
  },

  getBookingStats(): BookingStats {
    const bookings = getBookingsFromStorage();

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed",
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled",
    ).length;
    const totalRevenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
    };
  },
};
