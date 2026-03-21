import { Station, STATIONS } from "@/types/schedule";

const getStationsFromStorage = (): Station[] => {
  const stored = localStorage.getItem("stations");
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem("stations", JSON.stringify(STATIONS));
  return STATIONS;
};

const saveStationsToStorage = (stations: Station[]): void => {
  localStorage.setItem("stations", JSON.stringify(stations));
};

export const stationService = {
  getAllStations(): Station[] {
    return getStationsFromStorage();
  },

  createStation(station: Omit<Station, "id">): Station {
    const stations = getStationsFromStorage();
    const newStation: Station = {
      ...station,
      id: `${Date.now()}`,
    };

    stations.push(newStation);
    saveStationsToStorage(stations);

    return newStation;
  },

  updateStation(
    id: string,
    stationData: Partial<Station>,
  ): Station {
    const stations = getStationsFromStorage();
    const index = stations.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error("Station not found");
    }

    const updatedStation = {
      ...stations[index],
      ...stationData,
      id,
    };

    stations[index] = updatedStation;
    saveStationsToStorage(stations);

    return updatedStation;
  },

  deleteStation(id: string): void {
    const stations = getStationsFromStorage();
    const filtered = stations.filter((s) => s.id !== id);

    if (filtered.length === stations.length) {
      throw new Error("Station not found");
    }

    saveStationsToStorage(filtered);
  },
};