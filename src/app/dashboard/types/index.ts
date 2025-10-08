export interface DashboardState {
  currentTime: Date;
  userName: string;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStats {
  label: string;
  value: string;
  trend: string;
}

export interface DashboardAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export interface DashboardHookReturn {
  // State
  currentTime: Date;
  userName: string;
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  greeting: string;
  stats: DashboardStats[];
  
  // Actions
  handleLogout: () => void;
  refreshData: () => Promise<void>;
  
  // Utilities
  formatTime: (date: Date) => string;
}

export interface HeaderProps {
  currentTime: Date;
  greeting: string;
  userName: string;
  onLogout: () => void;
}

export interface WelcomeSectionProps {
  greeting: string;
  subtitle: string;
}

export interface StatsGridProps {
  stats: DashboardStats[];
  isLoading?: boolean;
}

export interface QuickActionsProps {
  actions: DashboardAction[];
  onActionClick?: (action: DashboardAction) => void;
}