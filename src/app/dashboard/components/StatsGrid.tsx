import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { StatsGridProps } from "../types";

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardDescription className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-6 w-12 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-muted-foreground">
              {stat.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                stat.trend.startsWith('+') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {stat.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}