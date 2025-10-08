import { useAuth } from "@/lib/auth/AuthContext";
import { WelcomeSectionProps } from "../types";

export function WelcomeSection({ greeting, subtitle }: WelcomeSectionProps) {
  const { user } = useAuth();
  return (
    <div className="mb-4">
      <h2 className="font-serif text-5xl text-foreground mb-2 italic">
        {greeting}, {user?.user_metadata?.full_name?.split(" ")[0]}
      </h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
}
