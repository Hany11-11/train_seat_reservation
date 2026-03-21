import { Coach, Seat, SeatStatus } from "@/types/seat";
import {
  getCoachesForTrain,
  generateSeatsForCoach,
  updateSeatStatus as updateSeatStatusInStorage,
} from "@/data/seats.mock";
import { scheduleService } from "./scheduleService";

export const seatService = {
  getSeatLayout(scheduleId: string, date: string): any {
    const schedule = scheduleService.getScheduleById(scheduleId);
    const coaches = getCoachesForTrain(schedule.trainId);

    const coachesWithSeats = coaches.map((coach) => ({
      ...coach,
      seats: generateSeatsForCoach(coach, scheduleId, date),
    }));

    return {
      success: true,
      coaches: coachesWithSeats,
    };
  },

  getAllSeats(): Seat[] {
    return [];
  },

  updateSeatStatus(id: string, status: string): Seat {
    return {
      id,
      coachId: "mock",
      seatNumber: "1",
      row: 1,
      column: 1,
      status: status as SeatStatus,
      classType: "2ND",
    };
  },
};