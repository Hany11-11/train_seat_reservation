import { Schedule, RouteStop, Station } from "@/types/schedule";
import { apiClient } from "@/lib/apiClient";
import { STATIONS } from "@/types/schedule";

interface ApiSchedule {
  _id?: string;
  id?: string;
  train?: any;
  fromStation?: any;
  toStation?: any;
  route?: RouteStop[];
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

const getIdFromRef = (ref: any): string => {
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  if (ref._id) return ref._id;
  if (ref.id) return ref.id;
  return '';
};

const getNameFromRef = (ref: any): string => {
  if (!ref) return '';
  if (typeof ref === 'string') return '';
  return ref.name || '';
};

const mapApiScheduleToSchedule = (apiSchedule: ApiSchedule, trains: any[] = [], stations: Station[] = STATIONS): Schedule => {
  const trainId = getIdFromRef(apiSchedule.train);
  const fromStationId = getIdFromRef(apiSchedule.fromStation);
  const toStationId = getIdFromRef(apiSchedule.toStation);
  
  const trainData = trains.find((t: any) => t.id === trainId || t._id === trainId) || 
    (typeof apiSchedule.train === 'object' ? apiSchedule.train : null);
  const fromStationData = (stations as any[]).find((s: any) => s.id === fromStationId || s._id === fromStationId) ||
    (typeof apiSchedule.fromStation === 'object' ? apiSchedule.fromStation : null);
  const toStationData = (stations as any[]).find((s: any) => s.id === toStationId || s._id === toStationId) ||
    (typeof apiSchedule.toStation === 'object' ? apiSchedule.toStation : null);
  
  return {
    id: apiSchedule._id || apiSchedule.id || '',
    train: trainId,
    fromStation: fromStationId,
    toStation: toStationId,
    route: apiSchedule.route || [],
    status: apiSchedule.status || 'ACTIVE',
    trainData: trainData,
    fromStationData: fromStationData,
    toStationData: toStationData,
  };
};

export interface SearchTrainResult {
  scheduleId: string;
  trainId: string;
  trainName: string;
  trainNumber: string;
  trainDescription?: string;
  fromStation: {
    id: string;
    name: string;
    code: string;
    city?: string;
  };
  toStation: {
    id: string;
    name: string;
    code: string;
    city?: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromStationRoute?: {
    id: string;
    name: string;
    arrivalTime: string;
    departureTime: string;
  };
  toStationRoute?: {
    id: string;
    name: string;
    arrivalTime: string;
    departureTime: string;
  };
  userDuration?: string;
  prices: {
    [classType: string]: {
      price: number;
      currency: string;
    };
  };
  availability: {
    [classType: string]: {
      totalSeats: number;
      availableSeats: number;
      coaches: Array<{
        coachName: string;
        totalSeats: number;
        layout?: string;
        rows: number;
        seatsPerRow: number;
      }>;
    };
  };
  classTypes: string[];
  route?: Array<{
    stationId: string;
    stationName: string;
    stationCode: string;
    arrivalTime: string;
    departureTime: string;
  }>;
  status: string;
}

export const scheduleService = {
  async searchTrains(fromStationId: string, toStationId: string): Promise<SearchTrainResult[]> {
    try {
      const response = await apiClient.get<{ success: boolean; count: number; data: SearchTrainResult[] }>(
        "/schedules/search",
        {
          params: { fromStationId, toStationId },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error searching trains:", error);
      throw error;
    }
  },

  async getAllSchedules(trains: any[] = [], stations: Station[] = STATIONS): Promise<Schedule[]> {
    try {
      const response = await apiClient.get<any>('/schedules');
      console.log('Schedules response:', response.data);
      let data = response.data;
      
      if (data?.data) {
        data = data.data;
      }
      
      if (!Array.isArray(data)) {
        data = [data];
      }
      
      return data.filter(Boolean).map((item: any) => mapApiScheduleToSchedule(item, trains, stations));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return [];
    }
  },

  async getScheduleById(id: string, trains: any[] = [], stations: Station[] = STATIONS): Promise<Schedule> {
    try {
      const response = await apiClient.get<any>(`/schedules/${id}`);
      const data = response.data?.data || response.data;
      return mapApiScheduleToSchedule(data, trains, stations);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  async createSchedule(schedule: Omit<Schedule, 'id' | 'trainData' | 'fromStationData' | 'toStationData'>): Promise<Schedule> {
    try {
      const apiSchedule = {
        train: schedule.train,
        fromStation: schedule.fromStation,
        toStation: schedule.toStation,
        route: schedule.route,
        status: schedule.status,
      };
      const response = await apiClient.post<any>('/schedules', apiSchedule);
      const data = response.data?.data || response.data;
      return mapApiScheduleToSchedule(data);
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  async updateSchedule(id: string, scheduleData: Partial<Schedule>): Promise<Schedule> {
    try {
      const apiSchedule: Record<string, any> = {};
      if (scheduleData.train !== undefined) apiSchedule.train = scheduleData.train;
      if (scheduleData.fromStation !== undefined) apiSchedule.fromStation = scheduleData.fromStation;
      if (scheduleData.toStation !== undefined) apiSchedule.toStation = scheduleData.toStation;
      if (scheduleData.route !== undefined) apiSchedule.route = scheduleData.route;
      if (scheduleData.status !== undefined) apiSchedule.status = scheduleData.status;

      const response = await apiClient.put<any>(`/schedules/${id}`, apiSchedule);
      const data = response.data?.data || response.data;
      return mapApiScheduleToSchedule(data);
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  async deleteSchedule(id: string): Promise<void> {
    try {
      await apiClient.delete(`/schedules/${id}`);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },
};
