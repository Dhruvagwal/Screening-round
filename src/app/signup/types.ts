export interface SignupState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface GoogleSignupOptions {
  redirectTo?: string;
  scopes?: string;
}

import { FieldErrors, UseFormRegister, UseFormHandleSubmit } from "react-hook-form";
import { SignupFormData } from "./schemas/signupSchema";

export interface SignupHookReturn {
  // Form handling
  register: UseFormRegister<SignupFormData>;
  handleSubmit: UseFormHandleSubmit<SignupFormData>;
  formState: {
    errors: FieldErrors<SignupFormData>;
    isSubmitting: boolean;
    isValid: boolean;
  };
  
  // Signup state
  signupState: SignupState;
  
  // Actions
  onSubmit: (data: SignupFormData) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  
  // Utilities
  reset: () => void;
}