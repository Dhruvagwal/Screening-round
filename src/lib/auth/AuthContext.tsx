"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../supabase/auth";
import { getUserToken } from "../supabase/tokens";
import type { AuthUser } from "../supabase/client";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  connectedAccountId: string | null;
  refreshConnectedAccount: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(null);

  // Function to refresh connected account ID
  const refreshConnectedAccount = async () => {
    if (!user?.id) {
      setConnectedAccountId(null);
      return;
    }

    try {
      const result = await getUserToken(user.id);
      if (result.success && result.data) {
        setConnectedAccountId(result.data.connected_account_id);
      } else {
        setConnectedAccountId(null);
      }
    } catch (error) {
      console.error("Error fetching connected account:", error);
      setConnectedAccountId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await AuthService.getSession();
        if (!isMounted) return;
        
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        
        // Load connected account ID if user exists
        if (sessionUser?.id) {
          const result = await getUserToken(sessionUser.id);
          if (result.success && result.data && isMounted) {
            setConnectedAccountId(result.data.connected_account_id);
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      
      // Load connected account ID for new user
      if (sessionUser?.id) {
        try {
          const result = await getUserToken(sessionUser.id);
          if (result.success && result.data && isMounted) {
            setConnectedAccountId(result.data.connected_account_id);
          } else {
            setConnectedAccountId(null);
          }
        } catch (error) {
          console.error("Error loading connected account on auth change:", error);
          setConnectedAccountId(null);
        }
      } else {
        setConnectedAccountId(null);
      }
      
      setLoading(false);

      // Use client-side navigation instead of window.location.href
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      } else if (event === "SIGNED_OUT") {
        router.push("/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      await AuthService.signInWithEmail(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await AuthService.signInWithGoogle();
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      await AuthService.signUp(email, password, metadata);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    console.log("Signing out user");
    try {
      await AuthService.signOut();
      setUser(null);
      setConnectedAccountId(null);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    connectedAccountId,
    refreshConnectedAccount,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };
  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
