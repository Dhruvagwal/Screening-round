import React from 'react';
import { Calendar, Clock, Users, Zap, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onQuickAction: (message: string) => void;
}

const quickActions = [
  {
    icon: Calendar,
    title: "Show my schedule",
    message: "Show me my schedule for today",
    color: "text-blue-500"
  },
  {
    icon: Clock,
    title: "Upcoming meetings",
    message: "What meetings do I have coming up?",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "Free time slots",
    message: "When am I free this week?",
    color: "text-purple-500"
  },
  {
    icon: Zap,
    title: "Calendar summary",
    message: "Give me a summary of my calendar activity",
    color: "text-orange-500"
  }
];

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-serif italic text-foreground mb-2">
          Welcome to Zen Mode
        </h2>
        <p className="text-muted-foreground max-w-md">
          Your intelligent calendar assistant. Ask me anything about your schedule, meetings, or availability.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Try asking me about:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-colors"
                onClick={() => onQuickAction(action.message)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${action.color}`} />
                  <div>
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      "{action.message}"
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-md">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Pro tip:</strong> You can ask me to schedule meetings, find conflicts, 
          analyze your calendar patterns, or get personalized insights about your time management.
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;