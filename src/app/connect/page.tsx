"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useUserToken from "@/lib/supabase/useUserToken";

export default function Home() {
  const { user, loading, refreshConnectedAccount } = useAuth();
  const { saveToken } = useUserToken();
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const connected_account_id = searchParams.get("connected_account_id");
  useEffect(() => {
    if (!loading) {
      if (user && status === "success" && connected_account_id) {
        saveToken(connected_account_id).then(async () => {
          router.push("/dashboard");
        });
      } else {
        // User is not authenticated, redirect to login
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Show loading spinner while checking authentication
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    </div>
  );
}
