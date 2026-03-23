import { Station } from "@/types/schedule";
import { apiClient } from "@/lib/apiClient";

interface ApiStation {
  _id?: string;
  id?: string;
  name?: string;
  code?: string;
  city?: string;
}

const mapApiStationToStation = (apiStation: ApiStation): Station => ({
  id: apiStation._id || apiStation.id || '',
  name: apiStation.name || '',
  code: apiStation.code || '',
  city: apiStation.city || '',
});

export const stationService = {
  async getAllStations(): Promise<Station[]> {
    const response = await apiClient.get<any>('/stations');
    console.log('Stations response:', response.data);
    let data = response.data;
    
    if (data?.data) {
      data = data.data;
    }
    
    if (!Array.isArray(data)) {
      data = [data];
    }
    
    return data.filter(Boolean).map((item: any) => mapApiStationToStation(item));
  },

  async getStationById(id: string): Promise<Station> {
    const response = await apiClient.get<any>(`/stations/${id}`);
    const data = response.data?.data || response.data;
    return mapApiStationToStation(data);
  },

  async createStation(station: Omit<Station, "id">): Promise<Station> {
    const apiStation = {
      name: station.name,
      code: station.code,
      city: station.city,
    };
    const response = await apiClient.post<any>('/stations', apiStation);
    const data = response.data?.data || response.data;
    return mapApiStationToStation(data);
  },

  async updateStation(id: string, stationData: Partial<Station>): Promise<Station> {
    const apiStation: Record<string, any> = {};
    if (stationData.name !== undefined) apiStation.name = stationData.name;
    if (stationData.code !== undefined) apiStation.code = stationData.code;
    if (stationData.city !== undefined) apiStation.city = stationData.city;

    const response = await apiClient.put<any>(`/stations/${id}`, apiStation);
    const data = response.data?.data || response.data;
    return mapApiStationToStation(data);
  },

  async deleteStation(id: string): Promise<void> {
    await apiClient.delete(`/stations/${id}`);
  },
};
