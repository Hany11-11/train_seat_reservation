import { Schedule, STATIONS } from "@/types/schedule";
import { mockSchedules } from "@/data/schedules.mock";
import { getTrainsFromStorage } from "@/data/trains.mock";

export interface ScheduleSearchParams {
  fromStationId: string;
  toStationId: string;
  date: string;
  passengers: number;
}

const getSchedulesFromStorage = (): Schedule[] => {
  const stored = localStorage.getItem("schedules");
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem("schedules", JSON.stringify(mockSchedules));
  return mockSchedules;
};

const saveSchedulesToStorage = (schedules: Schedule[]): void => {
  localStorage.setItem("schedules", JSON.stringify(schedules));
};

export const scheduleService = {
  getAllSchedules(): Schedule[] {
    return getSchedulesFromStorage();
  },

  searchSchedules(params: ScheduleSearchParams): any[] {
    const schedules = getSchedulesFromStorage();
    const trains = getTrainsFromStorage();

    const filtered = schedules.filter(
      (s) =>
        s.fromStationId === params.fromStationId &&
        s.toStationId === params.toStationId &&
        s.isActive &&
        s.travelDates.includes(params.date),
    );

    return filtered.map((schedule) => {
      const train = trains.find((t) => t.id === schedule.trainId);
      const fromStation = STATIONS.find(
        (st) => st.id === schedule.fromStationId,
      );
      const toStation = STATIONS.find((st) => st.id === schedule.toStationId);

      return {
        ...schedule,
        train,
        fromStation,
        toStation,
      };
    });
  },

  getScheduleById(id: string): Schedule {
    const schedules = getSchedulesFromStorage();
    const schedule = schedules.find((s) => s.id === id);

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    return schedule;
  },

  createSchedule(schedule: Omit<Schedule, "id">): Schedule {
    const schedules = getSchedulesFromStorage();
    const newSchedule: Schedule = {
      ...schedule,
      id: `s${Date.now()}`,
    };

    schedules.push(newSchedule);
    saveSchedulesToStorage(schedules);

    return newSchedule;
  },

  updateSchedule(
    id: string,
    scheduleData: Partial<Schedule>,
  ): Schedule {
    const schedules = getSchedulesFromStorage();
    const index = schedules.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error("Schedule not found");
    }

    const updatedSchedule = {
      ...schedules[index],
      ...scheduleData,
      id,
    };

    schedules[index] = updatedSchedule;
    saveSchedulesToStorage(schedules);

    return updatedSchedule;
  },

  deleteSchedule(id: string): void {
    const schedules = getSchedulesFromStorage();
    const filtered = schedules.filter((s) => s.id !== id);

    if (filtered.length === schedules.length) {
      throw new Error("Schedule not found");
    }

    saveSchedulesToStorage(filtered);
  },
};