import { authData } from "@/data/auth";

export function SignupHeader() {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-6xl text-foreground italic">
        {authData.signup.title}
      </h1>
      <p className="text-muted-foreground mt-2">{authData.signup.subtitle}</p>
    </div>
  );
}
