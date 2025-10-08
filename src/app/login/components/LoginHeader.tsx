import { LoginHeaderProps } from "../types";

export function LoginHeader({ title, subtitle }: LoginHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-6xl text-foreground italic">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2">
        {subtitle}
      </p>
    </div>
  );
}