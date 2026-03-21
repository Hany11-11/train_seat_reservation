import { Train } from "@/types/train";
import { getTrainsFromStorage, saveTrainsToStorage } from "@/data/trains.mock";

export interface TrainResponse {
  success: boolean;
  data: Train | Train[];
}

export const trainService = {
  getAllTrains(): Train[] {
    return getTrainsFromStorage();
  },

  getTrainById(id: string): Train {
    const trains = getTrainsFromStorage();
    const train = trains.find((t) => t.id === id);

    if (!train) {
      throw new Error("Train not found");
    }

    return train;
  },

  createTrain(
    train: Omit<Train, "id" | "createdAt" | "updatedAt">,
  ): Train {
    const trains = getTrainsFromStorage();
    const newTrain: Train = {
      ...train,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trains.push(newTrain);
    saveTrainsToStorage(trains);

    return newTrain;
  },

  updateTrain(id: string, trainData: Partial<Train>): Train {
    const trains = getTrainsFromStorage();
    const index = trains.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Train not found");
    }

    const updatedTrain = {
      ...trains[index],
      ...trainData,
      id,
      updatedAt: new Date().toISOString(),
    };

    trains[index] = updatedTrain;
    saveTrainsToStorage(trains);

    return updatedTrain;
  },

  toggleTrainStatus(id: string): Train {
    const trains = getTrainsFromStorage();
    const index = trains.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Train not found");
    }

    trains[index].isActive = !trains[index].isActive;
    trains[index].updatedAt = new Date().toISOString();
    saveTrainsToStorage(trains);

    return trains[index];
  },

  deleteTrain(id: string): void {
    const trains = getTrainsFromStorage();
    const filtered = trains.filter((t) => t.id !== id);

    if (filtered.length === trains.length) {
      throw new Error("Train not found");
    }

    saveTrainsToStorage(filtered);
  },
};