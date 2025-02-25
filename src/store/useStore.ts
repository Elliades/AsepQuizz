import { create } from 'zustand';
import { User, QuizSeries, Subject } from '../types';

interface Store {
  user: User | null;
  currentSeries: QuizSeries | null;
  subjects: Subject[];
  setUser: (user: User | null) => void;
  setCurrentSeries: (series: QuizSeries | null) => void;
  setSubjects: (subjects: Subject[]) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  currentSeries: null,
  subjects: [],
  setUser: (user) => set({ user }),
  setCurrentSeries: (series) => set({ currentSeries: series }),
  setSubjects: (subjects) => set({ subjects }),
})); 