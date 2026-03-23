import { Price, PriceFormData } from "@/types/price";
import { apiClient } from "@/lib/apiClient";

interface ApiPrice {
  _id?: string;
  id?: string;
  schedule?: string;
  fromStation?: string;
  toStation?: string;
  classType?: '1ST' | '2ND' | '3RD';
  price?: number;
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

const mapApiPriceToPrice = (apiPrice: ApiPrice): Price => ({
  id: apiPrice._id || apiPrice.id || '',
  schedule: getIdFromRef(apiPrice.schedule),
  fromStation: getIdFromRef(apiPrice.fromStation),
  toStation: getIdFromRef(apiPrice.toStation),
  classType: apiPrice.classType || '3RD',
  price: apiPrice.price || 0,
  status: apiPrice.status || 'ACTIVE',
});

export const priceService = {
  async getAllPrices(): Promise<Price[]> {
    try {
      const response = await apiClient.get<any>('/prices');
      let data = response.data?.data || response.data || [];
      if (!Array.isArray(data)) data = [data];
      return data.filter(Boolean).map((item: any) => mapApiPriceToPrice(item));
    } catch (error) {
      console.error('Error fetching prices:', error);
      return [];
    }
  },

  async getPricesBySchedule(scheduleId: string): Promise<Price[]> {
    try {
      const response = await apiClient.get<any>(`/prices/schedule/${scheduleId}`);
      let data = response.data?.data || response.data || [];
      if (!Array.isArray(data)) data = [data];
      return data.filter(Boolean).map((item: any) => mapApiPriceToPrice(item));
    } catch (error) {
      console.error('Error fetching prices for schedule:', error);
      return [];
    }
  },

  async createPrice(priceData: PriceFormData): Promise<Price> {
    try {
      const apiPrice = {
        schedule: priceData.schedule,
        fromStation: priceData.fromStation,
        toStation: priceData.toStation,
        classType: priceData.classType,
        price: priceData.price,
        status: priceData.status,
      };
      const response = await apiClient.post<any>('/prices', apiPrice);
      const data = response.data?.data || response.data;
      return mapApiPriceToPrice(data);
    } catch (error) {
      console.error('Error creating price:', error);
      throw error;
    }
  },

  async updatePrice(id: string, priceData: Partial<PriceFormData>): Promise<Price> {
    try {
      const apiPrice: Record<string, any> = {};
      if (priceData.schedule !== undefined) apiPrice.schedule = priceData.schedule;
      if (priceData.fromStation !== undefined) apiPrice.fromStation = priceData.fromStation;
      if (priceData.toStation !== undefined) apiPrice.toStation = priceData.toStation;
      if (priceData.classType !== undefined) apiPrice.classType = priceData.classType;
      if (priceData.price !== undefined) apiPrice.price = priceData.price;
      if (priceData.status !== undefined) apiPrice.status = priceData.status;

      const response = await apiClient.put<any>(`/prices/${id}`, apiPrice);
      const data = response.data?.data || response.data;
      return mapApiPriceToPrice(data);
    } catch (error) {
      console.error('Error updating price:', error);
      throw error;
    }
  },

  async deletePrice(id: string): Promise<void> {
    try {
      await apiClient.delete(`/prices/${id}`);
    } catch (error) {
      console.error('Error deleting price:', error);
      throw error;
    }
  },

  async getPriceForSegment(scheduleId: string, fromStationId: string, toStationId: string, classType: string): Promise<number | null> {
    try {
      const response = await apiClient.get<any>(`/prices/segment`, {
        params: { scheduleId, fromStationId, toStationId, classType }
      });
      const data = response.data?.data;
      if (data) {
        return data.price || 0;
      }
      return null;
    } catch (error) {
      console.error('Error fetching segment price:', error);
      return null;
    }
  },
};
