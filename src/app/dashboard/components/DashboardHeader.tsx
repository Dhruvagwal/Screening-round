import { Button } from "@/components/ui/button";
import { HeaderProps } from "../types";

export function DashboardHeader({ currentTime, greeting, userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="font-serif text-xl font-bold text-card-foreground italic">
              katalyst
            </h1>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {greeting}, {userName}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="border-border text-card-foreground hover:bg-accent"
            >
              tune out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}