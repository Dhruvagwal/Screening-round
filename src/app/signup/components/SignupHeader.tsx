import { authData } from "@/data/auth";

export function SignupHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="font-serif text-4xl font-bold text-foreground italic">
        {authData.signup.title}
      </h1>
      <p className="text-muted-foreground mt-2">
        {authData.signup.subtitle}
      </p>
    </div>
  );
}