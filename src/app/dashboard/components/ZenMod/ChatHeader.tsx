import React from 'react';
import { Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  title?: string;
  subtitle?: string;
}

export function ChatHeader({ 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMaximized, 
  title = "Zen Mode", 
  subtitle = "Your intelligent calendar assistant" 
}: ChatHeaderProps) {
  return (
    <div className="flex items-center h-16 border-b justify-between p-4 bg-background/10 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {onMinimize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        )}
        
        {onMaximize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMaximize}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        
      </div>
    </div>
  );
}

export default ChatHeader;