import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "./schemas/auth";
import { LoginState, LoginHookReturn } from "./types";
import { useAuth } from "@/lib/auth/AuthContext";

export const useLogin = (): LoginHookReturn => {
  const [loginState, setLoginState] = useState<LoginState>({
    isLoading: false,
    error: null,
  });
  const { signIn, signInWithGoogle } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginState({ isLoading: true, error: null });
      await signIn(data.email, data.password);
      // Redirect happens in AuthContext after successful login
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      setLoginState({
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const onGoogleSignIn = async () => {
    try {
      setLoginState({ isLoading: true, error: null });
      await signInWithGoogle();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during Google sign in";
      setLoginState({
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const clearError = () => {
    setLoginState(prev => ({ ...prev, error: null }));
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    loginState,
    onSubmit,
    onGoogleSignIn,
    clearError,
  };
};