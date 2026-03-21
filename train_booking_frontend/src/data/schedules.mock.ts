import { Schedule } from '@/types/schedule';

const generateDates = (daysAhead: number = 30): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    trainId: 't1',
    fromStationId: '1',
    toStationId: '7',
    departureTime: '05:55',
    arrivalTime: '15:30',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 575,
  },
  {
    id: 's2',
    trainId: 't2',
    fromStationId: '1',
    toStationId: '6',
    departureTime: '06:25',
    arrivalTime: '09:45',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 200,
  },
  {
    id: 's3',
    trainId: 't3',
    fromStationId: '1',
    toStationId: '4',
    departureTime: '05:45',
    arrivalTime: '13:30',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 465,
  },
  {
    id: 's4',
    trainId: 't4',
    fromStationId: '1',
    toStationId: '5',
    departureTime: '06:00',
    arrivalTime: '10:30',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 270,
  },
  {
    id: 's5',
    trainId: 't5',
    fromStationId: '1',
    toStationId: '7',
    departureTime: '09:45',
    arrivalTime: '19:20',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 575,
  },
  {
    id: 's6',
    trainId: 't2',
    fromStationId: '6',
    toStationId: '1',
    departureTime: '15:00',
    arrivalTime: '18:20',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 200,
  },
  {
    id: 's7',
    trainId: 't1',
    fromStationId: '1',
    toStationId: '2',
    departureTime: '07:00',
    arrivalTime: '10:30',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 210,
  },
  {
    id: 's8',
    trainId: 't3',
    fromStationId: '4',
    toStationId: '1',
    departureTime: '06:00',
    arrivalTime: '13:45',
    travelDates: generateDates(),
    isActive: true,
    durationMinutes: 465,
  },
];

export const getSchedulesFromStorage = (): Schedule[] => {
  const stored = localStorage.getItem('schedules');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('schedules', JSON.stringify(mockSchedules));
  return mockSchedules;
};

export const saveSchedulesToStorage = (schedules: Schedule[]): void => {
  localStorage.setItem('schedules', JSON.stringify(schedules));
};
