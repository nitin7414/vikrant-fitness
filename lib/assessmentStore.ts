import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AssessmentData {
  name: string;
  email: string;
  phone: string;
  age: string;
  weightKg: string;
  targetWeightKg: string;
  fitnessGoal: string;
  workoutDays: string;
  /** ISO timestamp of when the assessment was last saved */
  savedAt: string | null;
}

interface AssessmentStore extends AssessmentData {
  setAssessment: (data: Partial<AssessmentData>) => void;
  clearAssessment: () => void;
}

const EMPTY: AssessmentData = {
  name: "",
  email: "",
  phone: "",
  age: "26",
  weightKg: "75",
  targetWeightKg: "70",
  fitnessGoal: "",
  workoutDays: "4-5 Days / Week",
  savedAt: null,
};

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      ...EMPTY,
      setAssessment: (data) =>
        set((state) => ({
          ...state,
          ...data,
          savedAt: new Date().toISOString(),
        })),
      clearAssessment: () => set({ ...EMPTY }),
    }),
    {
      name: "vf-assessment",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never)
      ),
      /**
       * Skip automatic rehydration on creation so Next.js SSR doesn't
       * try to read localStorage on the server.
       * Consumers must call `useAssessmentStore.persist.rehydrate()` once
       * inside a client-side useEffect.
       */
      skipHydration: true,
    }
  )
);
