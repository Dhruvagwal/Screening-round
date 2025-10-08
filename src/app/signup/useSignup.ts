"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupFormData } from "./schemas/signupSchema";
import { type SignupState, type SignupHookReturn } from "./types";
import { supabase } from "@/lib/supabase/client";

export function useSignup(): SignupHookReturn {
  const router = useRouter();
  
  const [signupState, setSignupState] = useState<SignupState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const {
    register,
    handleSubmit,
    formState,
    reset: resetForm,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const reset = () => {
    resetForm();
    setSignupState({
      isLoading: false,
      error: null,
      success: false,
    });
  };

  const onSubmit = async (data: SignupFormData) => {
    setSignupState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Sign up with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            full_name: `${data.firstName} ${data.lastName}`,
          },
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (authData.user && !authData.user.email_confirmed_at) {
        setSignupState({
          isLoading: false,
          error: null,
          success: true,
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login?message=Please check your email to confirm your account");
        }, 2000);
      } else if (authData.user) {
        // User is automatically signed in
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSignupState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const onGoogleSignIn = async () => {
    setSignupState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Google";
      setSignupState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  return {
    register,
    handleSubmit,
    formState,
    signupState,
    onSubmit,
    onGoogleSignIn,
    reset,
  };
}