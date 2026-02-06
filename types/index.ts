export interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
}

export interface ServiceRecord {
  id: string;
  carId: string;
  title: string; // e.g. "Oil Change"
  date: string; // ISO Date
  cost: number;
  mileageAtService: number;
  nextServiceMileage?: number; // The Reminder trigger
  notes?: string;
  serviceCenter?: string;
  productBrand?: string;
  isReminderDismissed?: boolean;
}

export interface Expense {
  id: string;
  carId: string;
  title: string;
  amount: number;
  date: string;
  category: 'Fuel' | 'Maintenance' | 'Insurance' | 'Tax' | 'Other';
}

export type RootStackParamList = {
  Home: undefined;
  AddCar: undefined;
  CarDetails: { carId: string };
  AddService: { carId: string };
  ServiceHistory: { carId: string };
};
