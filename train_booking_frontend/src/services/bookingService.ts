import { Booking, PassengerDetails, BookedSeat } from "@/types/booking";
import { apiClient } from "@/lib/apiClient";

export interface CreateBookingPayload {
  scheduleId: string;
  trainId: string;
  fromStationId: string;
  toStationId: string;
  travelDate: string;
  seats: BookedSeat[];
  passengerDetails: PassengerDetails;
}

export interface BackendBookingResponse {
  _id: string;
  user: string;
  schedule: {
    _id: string;
    train?: {
      _id: string;
      trainNumber?: string;
      name?: string;
    };
  };
  fromStation: {
    _id: string;
    name: string;
    code: string;
  };
  toStation: {
    _id: string;
    name: string;
    code: string;
  };
  date: string;
  classType: "1ST" | "2ND" | "3RD";
  seats: number;
  seatNumbers: string[];
  price: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

const mapBackendToFrontend = (backend: BackendBookingResponse): Booking => ({
  id: backend._id,
  referenceNumber: `TRN-${backend._id.slice(-8).toUpperCase()}`,
  userId: backend.user,
  scheduleId: typeof backend.schedule === 'object' ? backend.schedule._id : backend.schedule,
  trainId: typeof backend.schedule === 'object' && backend.schedule.train 
    ? (typeof backend.schedule.train === 'object' ? backend.schedule.train._id : backend.schedule.train) 
    : '',
  travelDate: backend.date,
  seats: backend.seatNumbers.map((num) => ({
    seatId: num,
    coachId: '',
    seatNumber: num,
    coachName: '',
    classType: backend.classType,
    price: backend.price / backend.seats,
  })),
  totalAmount: backend.price,
  status: backend.status === "CONFIRMED" ? "confirmed" : "cancelled",
  createdAt: backend.createdAt,
  passengerDetails: {
    name: "",
    nic: "",
    email: "",
    mobile: "",
  },
});

export const bookingService = {
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const response = await apiClient.post<BackendBookingResponse>(
      "/bookings",
      {
        schedule: payload.scheduleId,
        fromStation: payload.fromStationId,
        toStation: payload.toStationId,
        date: payload.travelDate,
        classType: payload.seats[0]?.classType || "3RD",
        seats: payload.seats.length,
        seatNumbers: payload.seats.map(s => s.seatNumber),
        price: payload.seats.reduce((sum, s) => sum + s.price, 0),
      }
    );
    return mapBackendToFrontend(response.data);
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get<{
      success: boolean;
      data: { bookings: BackendBookingResponse[] };
      count: number;
    }>("/bookings/my");
    return response.data.data.bookings.map(mapBackendToFrontend);
  },

  async getBookingById(id: string): Promise<Booking> {
    const response = await apiClient.get<BackendBookingResponse>(
      `/bookings/${id}`
    );
    return mapBackendToFrontend(response.data);
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await apiClient.put<BackendBookingResponse>(
      `/bookings/${id}/cancel`,
      {}
    );
    return mapBackendToFrontend(response.data);
  },

  async getAllBookings(): Promise<Booking[]> {
    const response = await apiClient.get<BackendBookingResponse[]>(
      "/bookings"
    );
    return response.data.map(mapBackendToFrontend);
  },
};
