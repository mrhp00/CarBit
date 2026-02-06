import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Car, ServiceRecord, Expense } from '../types';

type Language = 'en' | 'fa';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  cars: Car[];
  services: ServiceRecord[];
  expenses: Expense[];
  
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCarMileage: (carId: string, mileage: number) => void;
  removeCar: (carId: string) => void;
  
  addService: (service: Omit<ServiceRecord, 'id'>) => void;
  updateService: (id: string, service: Partial<Omit<ServiceRecord, 'id'>>) => void;
  removeService: (serviceId: string) => void;
  dismissReminder: (serviceId: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (expenseId: string) => void;

  importData: (data: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),

      cars: [],
      services: [],
      expenses: [],

      addCar: (carData) => set((state) => ({
        cars: [...state.cars, { ...carData, id: uuid.v4() as string }]
      })),

      updateCarMileage: (carId, mileage) => set((state) => ({
        cars: state.cars.map((c) => c.id === carId ? { ...c, currentMileage: mileage } : c)
      })),

      removeCar: (carId) => set((state) => ({
        cars: state.cars.filter((c) => c.id !== carId),
        services: state.services.filter(s => s.carId !== carId),
        expenses: state.expenses.filter(e => e.carId !== carId)
      })),

      addService: (serviceData) => set((state) => ({
        services: [...state.services, { ...serviceData, id: uuid.v4() as string }]
      })),

      updateService: (id, serviceData) => set((state) => ({
        services: state.services.map((s) => s.id === id ? { ...s, ...serviceData } : s)
      })),

      removeService: (serviceId) => set((state) => ({
        services: state.services.filter((s) => s.id !== serviceId)
      })),

      dismissReminder: (serviceId) => set((state) => ({
        services: state.services.map((s) => s.id === serviceId ? { ...s, isReminderDismissed: true } : s)
      })),

      addExpense: (expenseData) => set((state) => ({
        expenses: [...state.expenses, { ...expenseData, id: uuid.v4() as string }]
      })),

      removeExpense: (expenseId) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== expenseId)
      })),
      
      importData: (data: any) => set((state) => ({
        cars: data.cars || state.cars,
        services: data.services || state.services,
        expenses: data.expenses || state.expenses
      })),
    }),
    {
      name: 'car-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
