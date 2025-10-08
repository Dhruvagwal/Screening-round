"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { authData } from "@/data/auth";
import { LoginHeader, LoginForm } from "./components";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't render login form (redirect will happen)
  if (user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show login form for unauthenticated users
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className="max-w-5xl h-[70vh] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <LoginHeader
            title={authData.login.title}
            subtitle={authData.login.subtitle}
          />
          <LoginForm />
        </div>
        <div className="">
          <Image
            src={authData.login.imageSrc}
            alt="Login Illustration"
            className="w-full rounded-xl object-cover h-[70vh]"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
