export interface Train {
  id: string;
  trainNumber: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrainClass {
  id: string;
  name: string;
  code: '1ST' | '2ND' | '3RD';
  description: string;
}

export const TRAIN_CLASSES: TrainClass[] = [
  { id: '1', name: 'First Class', code: '1ST', description: 'Luxury seating with AC' },
  { id: '2', name: 'Second Class', code: '2ND', description: 'Comfortable seating with AC' },
  { id: '3', name: 'Third Class', code: '3RD', description: 'Economy seating' },
];
