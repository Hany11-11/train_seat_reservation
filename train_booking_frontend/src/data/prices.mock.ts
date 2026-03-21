import { Price } from '@/types/price';

export const mockPrices: Price[] = [
  // Schedule 1 prices (Colombo - Badulla)
  { id: 'p1-1', scheduleId: 's1', classType: '1ST', basePrice: 1500, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p1-2', scheduleId: 's1', classType: '2ND', basePrice: 800, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p1-3', scheduleId: 's1', classType: '3RD', basePrice: 350, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 2 prices (Colombo - Matara)
  { id: 'p2-1', scheduleId: 's2', classType: '1ST', basePrice: 800, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p2-2', scheduleId: 's2', classType: '2ND', basePrice: 450, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p2-3', scheduleId: 's2', classType: '3RD', basePrice: 200, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 3 prices (Colombo - Jaffna)
  { id: 'p3-1', scheduleId: 's3', classType: '1ST', basePrice: 2000, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p3-2', scheduleId: 's3', classType: '2ND', basePrice: 1200, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p3-3', scheduleId: 's3', classType: '3RD', basePrice: 500, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 4 prices (Colombo - Anuradhapura)
  { id: 'p4-1', scheduleId: 's4', classType: '1ST', basePrice: 1200, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p4-2', scheduleId: 's4', classType: '2ND', basePrice: 700, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p4-3', scheduleId: 's4', classType: '3RD', basePrice: 300, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 5 prices (Colombo - Badulla afternoon)
  { id: 'p5-1', scheduleId: 's5', classType: '1ST', basePrice: 1500, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p5-2', scheduleId: 's5', classType: '2ND', basePrice: 800, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p5-3', scheduleId: 's5', classType: '3RD', basePrice: 350, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 6 prices (Matara - Colombo)
  { id: 'p6-1', scheduleId: 's6', classType: '1ST', basePrice: 800, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p6-2', scheduleId: 's6', classType: '2ND', basePrice: 450, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p6-3', scheduleId: 's6', classType: '3RD', basePrice: 200, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 7 prices (Colombo - Kandy)
  { id: 'p7-1', scheduleId: 's7', classType: '1ST', basePrice: 600, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p7-2', scheduleId: 's7', classType: '2ND', basePrice: 350, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p7-3', scheduleId: 's7', classType: '3RD', basePrice: 150, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  
  // Schedule 8 prices (Jaffna - Colombo)
  { id: 'p8-1', scheduleId: 's8', classType: '1ST', basePrice: 2000, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p8-2', scheduleId: 's8', classType: '2ND', basePrice: 1200, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
  { id: 'p8-3', scheduleId: 's8', classType: '3RD', basePrice: 500, currency: 'LKR', isActive: true, updatedAt: '2024-01-01' },
];

export const getPricesFromStorage = (): Price[] => {
  const stored = localStorage.getItem('prices');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('prices', JSON.stringify(mockPrices));
  return mockPrices;
};

export const savePricesToStorage = (prices: Price[]): void => {
  localStorage.setItem('prices', JSON.stringify(prices));
};

export const getPricesForSchedule = (scheduleId: string): Price[] => {
  const prices = getPricesFromStorage();
  return prices.filter(p => p.scheduleId === scheduleId);
};
