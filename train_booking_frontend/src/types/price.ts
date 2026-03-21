export interface Price {
  id: string;
  scheduleId: string;
  classType: '1ST' | '2ND' | '3RD';
  basePrice: number;
  currency: string;
  isActive: boolean;
  updatedAt: string;
}

export interface PriceMatrix {
  scheduleId: string;
  prices: {
    '1ST': number;
    '2ND': number;
    '3RD': number;
  };
}
