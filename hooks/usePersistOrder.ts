import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  count: number;
  inc: () => void;
  reset: () => void;
};

const useCounter = create<State>()(
  persist(
    (set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: "counter-storage",
    //   storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCounter;