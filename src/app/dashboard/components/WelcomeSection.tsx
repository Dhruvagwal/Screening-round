import { WelcomeSectionProps } from "../types";

export function WelcomeSection({ greeting, subtitle }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-3xl font-bold text-foreground mb-2 italic">
        {greeting}
      </h2>
      <p className="text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}