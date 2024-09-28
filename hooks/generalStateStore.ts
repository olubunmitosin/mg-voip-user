import { GenerateStateProps } from '@/types';
import { create } from 'zustand'

export const useGeneralStateStore = create<GenerateStateProps>()((set) => ({
  data: {},
  insertItem: (key: string, value: any) => set((state) => ({ 
    data: {...state.data, [key]: value}
  })),
  removeItem: (key: string) => set((state) => ({
    data: Object.fromEntries(Object.entries(state.data).filter(([index]) => index !== key))
  })),
}));