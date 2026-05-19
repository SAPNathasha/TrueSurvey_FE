import { create } from "zustand";

type UserRole = "participant" | "creator" | "both" | "";

type SignupFormData = {
  fullName: string;
  email: string;
  password: string;

  role: UserRole;

  nicOrLicenseImage: File | null;
  selfieImage: File | null;
};

type SignupStore = {
  currentStep: number;
  formData: SignupFormData;

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  updateFormData: (data: Partial<SignupFormData>) => void;
  resetSignup: () => void;
};

const initialFormData: SignupFormData = {
  fullName: "",
  email: "",
  password: "",

  role: "",

  nicOrLicenseImage: null,
  selfieImage: null,
};

export const useSignupStore = create<SignupStore>((set) => ({
  currentStep: 1,

  formData: initialFormData,

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

  updateFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  resetSignup: () =>
    set({
      currentStep: 1,
      formData: initialFormData,
    }),
}));
