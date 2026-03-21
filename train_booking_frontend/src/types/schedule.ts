export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
}

export interface Schedule {
  id: string;
  trainId: string;
  fromStationId: string;
  toStationId: string;
  departureTime: string;
  arrivalTime: string;
  travelDates: string[];
  isActive: boolean;
  durationMinutes: number;
}

export interface RouteStop {
  stationId: string;
  arrivalTime: string;
  departureTime: string;
  stopOrder: number;
}

export const STATIONS: Station[] = [
  { id: '1', code: 'COL', name: 'Colombo Fort', city: 'Colombo' },
  { id: '2', code: 'KDY', name: 'Kandy', city: 'Kandy' },
  { id: '3', code: 'GAL', name: 'Galle', city: 'Galle' },
  { id: '4', code: 'JFN', name: 'Jaffna', city: 'Jaffna' },
  { id: '5', code: 'ANR', name: 'Anuradhapura', city: 'Anuradhapura' },
  { id: '6', code: 'MTR', name: 'Matara', city: 'Matara' },
  { id: '7', code: 'BDL', name: 'Badulla', city: 'Badulla' },
  { id: '8', code: 'TRC', name: 'Trincomalee', city: 'Trincomalee' },
];
