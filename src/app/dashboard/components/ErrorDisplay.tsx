"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="text-red-600 text-sm">⚠️</div>
          <div className="flex-1">
            <p className="text-red-800 font-medium">Something went wrong</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            {onRetry && (
              <Button 
                onClick={onRetry}
                variant="outline" 
                size="sm"
                className="mt-3 border-red-200 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}