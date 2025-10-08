import { useAuth } from "@/lib/auth/AuthContext";
import { WelcomeSectionProps } from "../types";
import { Button } from "@/components/ui/button";
import ZenMod from "./ZenMod";

export function WelcomeSection({ greeting, subtitle }: WelcomeSectionProps) {
  const { user } = useAuth();
  return (
    <div className="mb-4 flex justify-between items-start">
      <div className="flex mb-2 gap-4"> 
        <div>
          <h2 className="font-serif text-5xl text-foreground italic">
            {greeting}, {user?.user_metadata?.full_name?.split(" ")[0]}
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <ZenMod />
      </div>
      <div>
        <Button variant="link" className="underline">
          Tune out
        </Button>
      </div>
    </div>
  );
}
