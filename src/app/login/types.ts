import { FieldErrors, UseFormRegister, UseFormHandleSubmit } from "react-hook-form";
import { LoginFormData } from "./schemas/auth";

export interface LoginState {
  isLoading: boolean;
  error: string | null;
}

export interface LoginHookReturn {
  // Form state
  register: UseFormRegister<LoginFormData>;
  handleSubmit: UseFormHandleSubmit<LoginFormData>;
  formState: {
    errors: FieldErrors<LoginFormData>;
    isSubmitting: boolean;
    isValid: boolean;
  };
  // Login state
  loginState: LoginState;
  // Actions
  onSubmit: (data: LoginFormData) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  clearError: () => void;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export interface LoginHeaderProps {
  title: string;
  subtitle: string;
}