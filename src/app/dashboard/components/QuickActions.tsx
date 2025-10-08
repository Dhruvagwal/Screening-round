import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActionsProps } from "../types";
import { dashboardData } from "@/data/dashboard";

export function QuickActions({ actions, onActionClick }: QuickActionsProps) {
  const handleActionClick = (action: any) => {
    if (onActionClick) {
      onActionClick(action);
    } else if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
  };

  return (
    <Card className="mt-8 bg-card border-border">
      <CardHeader>
        <CardTitle className="font-serif italic text-card-foreground">
          Quick Actions
        </CardTitle>
        <CardDescription>
          Manage your calendar and meeting workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {dashboardData.actions.map((action, index) => (
            <Button 
              key={index}
              variant="outline" 
              className="border-border text-card-foreground hover:bg-accent"
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}