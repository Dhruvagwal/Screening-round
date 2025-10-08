"use client";

import { SignupHeader } from "./components/SignupHeader";
import { SignupForm } from "./components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <SignupHeader />
        <SignupForm />
      </div>
    </div>
  );
}