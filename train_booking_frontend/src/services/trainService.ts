import { Train } from "@/types/train";
import { apiClient } from "@/lib/apiClient";

export interface TrainResponse {
  success: boolean;
  data: Train | Train[] | any;
  message?: string;
}

interface ApiTrain {
  _id?: string;
  id?: string;
  train?: string;
  number?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const mapApiTrainToTrain = (apiTrain: ApiTrain): Train => ({
  id: apiTrain._id || apiTrain.id || '',
  trainNumber: apiTrain.number || apiTrain.train || '',
  name: apiTrain.train || apiTrain.name || '',
  description: apiTrain.description,
  isActive: apiTrain.isActive ?? true,
  createdAt: apiTrain.createdAt || new Date().toISOString(),
  updatedAt: apiTrain.updatedAt || new Date().toISOString(),
});

export const trainService = {
  async getAllTrains(): Promise<Train[]> {
    const response = await apiClient.get<any>('/trains');
    console.log('Trains response:', response.data);
    let data = response.data;
    
    if (data?.data) {
      data = data.data;
    }
    
    if (!Array.isArray(data)) {
      data = [data];
    }
    
    return data.filter(Boolean).map((item: any) => mapApiTrainToTrain(item));
  },

  async getTrainById(id: string): Promise<Train> {
    const response = await apiClient.get<any>(`/trains/${id}`);
    const data = response.data?.data || response.data;
    return mapApiTrainToTrain(data);
  },

  async createTrain(
    train: Omit<Train, "id" | "createdAt" | "updatedAt">
  ): Promise<Train> {
    const apiTrain = {
      train: train.name,
      number: train.trainNumber,
      description: train.description,
      isActive: train.isActive,
    };
    const response = await apiClient.post<any>('/trains', apiTrain);
    const data = response.data?.data || response.data;
    return mapApiTrainToTrain(data);
  },

  async updateTrain(id: string, trainData: Partial<Train>): Promise<Train> {
    const apiTrain: Record<string, any> = {};
    if (trainData.name !== undefined) apiTrain.train = trainData.name;
    if (trainData.trainNumber !== undefined) apiTrain.number = trainData.trainNumber;
    if (trainData.description !== undefined) apiTrain.description = trainData.description;
    if (trainData.isActive !== undefined) apiTrain.isActive = trainData.isActive;
    
    const response = await apiClient.put<any>(`/trains/${id}`, apiTrain);
    const data = response.data?.data || response.data;
    return mapApiTrainToTrain(data);
  },

  async deleteTrain(id: string): Promise<void> {
    await apiClient.delete(`/trains/${id}`);
  },

  async toggleTrainStatus(id: string): Promise<Train> {
    const response = await apiClient.patch<any>(`/trains/${id}/toggle-status`);
    const data = response.data?.data || response.data;
    return mapApiTrainToTrain(data);
  },
};
