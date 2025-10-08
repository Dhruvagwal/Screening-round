"use client";

import { authData } from "@/data/auth";
import { LoginHeader, LoginForm } from "./components";
import Image from "next/image";

export default function LoginPage() {
  console.log("LoginPage rendered");
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
