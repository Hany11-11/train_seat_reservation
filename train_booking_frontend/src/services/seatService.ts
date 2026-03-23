import { apiClient } from "@/lib/apiClient";

export interface CoachPayload {
  train: string;
  coachName: string;
  classType: "1ST" | "2ND" | "3RD";
  rows: number;
  seatsPerRow: number;
  layout: string;
}

export interface CoachResponse {
  _id?: string;
  id?: string;
  train: string | { _id?: string; id?: string; name?: string };
  coachName: string;
  classType: "1ST" | "2ND" | "3RD";
  rows: number;
  seatsPerRow: number;
  layout: string;
  totalSeats?: number;
}

export interface SeatAvailability {
  _id: string;
  seatNumber: string;
  row: number;
  column: string;
  status: "available" | "booked" | "unavailable";
  classType: string;
  coachId: string;
  coachName: string;
}

export interface CoachWithSeats {
  coachId: string;
  coachName: string;
  classType: string;
  layout: string;
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  seats: SeatAvailability[];
}

const mapCoachResponse = (coach: CoachResponse) => ({
  id: coach._id || coach.id || "",
  trainId: typeof coach.train === "object" ? coach.train._id || coach.train.id || "" : coach.train,
  name: coach.coachName,
  classType: coach.classType,
  totalSeats: coach.totalSeats || coach.rows * coach.seatsPerRow,
  seatsPerRow: coach.seatsPerRow,
  totalRows: coach.rows,
  layout: coach.layout,
});

export const seatService = {
  async getSeatAvailability(scheduleId: string, date: string, classType: string): Promise<{
    success: boolean;
    data: CoachWithSeats[];
    date: string;
    classType: string;
  }> {
    const response = await apiClient.get<any>("/seats/availability", {
      params: { scheduleId, date, classType },
    });
    return response.data;
  },

  async getAllCoaches(): Promise<any[]> {
    const response = await apiClient.get<any>("/seats");
    let data = response.data;
    if (data?.data) data = data.data;
    if (!Array.isArray(data)) data = [data];
    return (data || []).filter(Boolean).map((item: any) => mapCoachResponse(item));
  },

  async createCoach(coachData: CoachPayload): Promise<any> {
    const payload = {
      train: coachData.train,
      coachName: coachData.coachName,
      classType: coachData.classType,
      rows: coachData.rows,
      seatsPerRow: coachData.seatsPerRow,
      layout: coachData.layout,
    };
    const response = await apiClient.post<any>("/seats", payload);
    const data = response.data?.data || response.data;
    return mapCoachResponse(data);
  },

  async updateCoach(id: string, coachData: Partial<CoachPayload>): Promise<any> {
    const payload: Record<string, any> = {};
    if (coachData.train !== undefined) payload.train = coachData.train;
    if (coachData.coachName !== undefined) payload.coachName = coachData.coachName;
    if (coachData.classType !== undefined) payload.classType = coachData.classType;
    if (coachData.rows !== undefined) payload.rows = coachData.rows;
    if (coachData.seatsPerRow !== undefined) payload.seatsPerRow = coachData.seatsPerRow;
    if (coachData.layout !== undefined) payload.layout = coachData.layout;

    const response = await apiClient.put<any>(`/seats/${id}`, payload);
    const data = response.data?.data || response.data;
    return mapCoachResponse(data);
  },

  async deleteCoach(id: string): Promise<void> {
    await apiClient.delete(`/seats/${id}`);
  },
};
