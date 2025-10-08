import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingData } from "@/data/landing";

export function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="font-serif text-xl font-bold text-foreground italic">
              {landingData.brand.name}
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              about us
            </Link>
            <Link href="/cohorts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              cohorts
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              tune in
            </Link>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              projects
            </Link>
            <Link href="/promotions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              promotions
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-foreground">
                tune in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}