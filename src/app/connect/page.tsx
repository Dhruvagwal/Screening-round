"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Loader2 } from "lucide-react";
import useUserToken from "@/lib/supabase/useUserToken";

export default function Home() {
  const { user, loading } = useAuth();
  const { saveToken } = useUserToken();
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const connected_account_id = searchParams.get("connected_account_id");

  console.log("Render:", { status, connected_account_id, user, loading });

  useEffect(() => {
    console.log("Effect triggered:", { status, connected_account_id, user, loading });

    if (loading) return; // wait until auth state resolves

    if (user && status === "success" && connected_account_id) {
      console.log("Saving token and redirecting...");
      saveToken(connected_account_id).then(() => {
        router.push("/dashboard");
      });
    } else if (!user && !loading) {
      console.log("Redirecting to login...");
      router.push("/login");
    }
  }, [user, loading, status, connected_account_id, router, saveToken]);

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
