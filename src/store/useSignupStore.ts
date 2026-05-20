import { create } from "zustand";

type SignupStore = {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetSignup: () => void;
};

export const useSignupStore = create<SignupStore>((set) => ({
  currentStep: 1,

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  goToStep: (step) =>
    set({
      currentStep: step,
    }),

  resetSignup: () =>
    set({
      currentStep: 1,
    }),
}));
