export interface Price {
  id: string;
  schedule: string;
  fromStation: string;
  toStation: string;
  classType: '1ST' | '2ND' | '3RD';
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  scheduleData?: any;
  fromStationData?: any;
  toStationData?: any;
}

export interface PriceFormData {
  schedule: string;
  fromStation: string;
  toStation: string;
  classType: '1ST' | '2ND' | '3RD';
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
}
