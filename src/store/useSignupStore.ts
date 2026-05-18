import { create } from "zustand";

export type UserRole = "participant" | "creator" | "both" | "";

type SignupState = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  nicFile: File | null;
  selfieFile: File | null;

  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRole: (role: UserRole) => void;
  setNicFile: (file: File | null) => void;
  setSelfieFile: (file: File | null) => void;
  resetSignup: () => void;
};

export const useSignupStore = create<SignupState>((set) => ({
  username: "",
  email: "",
  password: "",
  role: "",
  nicFile: null,
  selfieFile: null,

  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setRole: (role) => set({ role }),
  setNicFile: (file) => set({ nicFile: file }),
  setSelfieFile: (file) => set({ selfieFile: file }),

  resetSignup: () =>
    set({
      username: "",
      email: "",
      password: "",
      role: "",
      nicFile: null,
      selfieFile: null,
    }),
}));