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
  variant?: "default" | "outline" | "secondary" | "ghost";
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

// Calendar-related types
export interface ConferenceProperties {
  allowedConferenceSolutionTypes: string[];
}

export interface DefaultReminder {
  method: string;
  minutes: number;
}

export interface Calendar {
  accessRole: "owner" | "reader" | "writer" | "freeBusyReader";
  backgroundColor: string;
  colorId: string;
  foregroundColor: string;
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  conferenceProperties: ConferenceProperties;
  defaultReminders: DefaultReminder[];
  etag: string;
  kind: string;
  selected: boolean;
  timeZone: string;
}

export interface Event {
  id: string;
  summary: string;
  description?: string;
  hangoutLink?: string;
  htmlLink: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  status?: string;
  organizer?: {
    email: string;
    self?: boolean;
  };
}

export interface EventsApiResponse {
  success: boolean;
  data: {
    items?: Event[];
  };
  error?: string;
}
export interface StatsGridProps {
  stats: DashboardStats[];
  isLoading?: boolean;
}

export interface QuickActionsProps {
  actions: DashboardAction[];
  onActionClick?: (action: DashboardAction) => void;
}

// Calendar details types
export interface CalendarDetails {
  calendarId: string;
  details: {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    timeZone: string;
    accessRole: string;
    backgroundColor?: string;
    foregroundColor?: string;
    colorId?: string;
    conferenceProperties?: ConferenceProperties;
    defaultReminders?: DefaultReminder[];
    notificationSettings?: {
      notifications: Array<{
        type: string;
        method: string;
      }>;
    };
    primary?: boolean;
    selected?: boolean;
    etag?: string;
    kind?: string;
  };
}

export interface CalendarDetailsApiResponse {
  success: boolean;
  data?: {
    successful: CalendarDetails[];
    failed: Array<{
      calendarId: string;
      success: false;
      error: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
  userId?: string;
  connectedAccountId?: string;
  timestamp?: string;
  error?: string;
  message?: string;
}
