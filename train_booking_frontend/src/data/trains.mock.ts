import { Train } from '@/types/train';

export const mockTrains: Train[] = [
  {
    id: 't1',
    trainNumber: 'EXP-1001',
    name: 'Udarata Menike',
    description: 'Colombo to Badulla Express',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't2',
    trainNumber: 'INT-2002',
    name: 'Ruhunu Kumari',
    description: 'Colombo to Matara Intercity',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't3',
    trainNumber: 'EXP-3003',
    name: 'Yal Devi',
    description: 'Colombo to Jaffna Express',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't4',
    trainNumber: 'INT-4004',
    name: 'Rajarata Rajini',
    description: 'Colombo to Anuradhapura Intercity',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't5',
    trainNumber: 'EXP-5005',
    name: 'Podi Menike',
    description: 'Colombo to Badulla Express',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't6',
    trainNumber: 'INT-6006',
    name: 'Galu Kumari',
    description: 'Colombo to Galle Intercity',
    isActive: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const getTrainsFromStorage = (): Train[] => {
  const stored = localStorage.getItem('trains');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('trains', JSON.stringify(mockTrains));
  return mockTrains;
};

export const saveTrainsToStorage = (trains: Train[]): void => {
  localStorage.setItem('trains', JSON.stringify(trains));
};
