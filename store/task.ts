import { create } from "zustand";

interface TaskStore {
  search: string;
  setSearch: (value: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  search: "",
  setSearch: (value: string) => set({ search: value }),
}));