    # Calendar Meetings Component Architecture

## Overview
The CalenderMeetings component has been refactored into a modular, skeleton-loading architecture with proper separation of concerns.

## Component Structure

### Main Component
- **`CalenderMeetings.tsx`** - Main container component that orchestrates the meeting display

### Modular Sub-Components
- **`meetings/MeetingCard.tsx`** - Individual meeting card component with hover effects and click handling
- **`meetings/UpcomingMeetings.tsx`** - Container for upcoming meetings with refresh functionality
- **`meetings/PastMeetings.tsx`** - Container for past meetings with history icon

### Skeleton Loading Components
- **`skeletons/MeetingSkeleton.tsx`** - Skeleton loading states for meeting cards and sections
- **`ui/skeleton.tsx`** - Base skeleton component with pulse animation

## Features

### ✅ Skeleton Loading
- Replaced simple loading text with animated skeleton components
- Provides visual feedback during data fetching
- Maintains layout consistency while loading

### ✅ Modular Architecture
- Separated concerns into reusable components
- Each component has a single responsibility
- Easy to maintain and extend

### ✅ Responsive Design
- Cards adapt to different screen sizes
- Proper spacing and typography
- Hover effects and transitions

### ✅ Error Handling
- Graceful error states with retry options
- Clear error messages for different scenarios
- Fallback UI for empty states

## Component Hierarchy

```
CalenderMeetings
├── UpcomingMeetings
│   ├── MeetingCard (×N)
│   └── MeetingsSectionSkeleton (loading state)
└── PastMeetings
    ├── MeetingCard (×N)
    └── MeetingsSectionSkeleton (loading state)
```

## Props Interface

### MeetingCard Props
```typescript
interface MeetingCardProps {
  meeting: Meeting;
  onCardClick?: (meeting: Meeting) => void;
}
```

### Section Props
```typescript
interface MeetingSectionProps {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  onMeetingClick?: (meeting: Meeting) => void;
}
```

## Usage Example

```tsx
import { CalenderMeetings } from "@/app/dashboard/components";

// Simple usage
<CalenderMeetings />

// With individual components
import { UpcomingMeetings, PastMeetings } from "@/app/dashboard/components/meetings";

<UpcomingMeetings 
  meetings={upcomingMeetings}
  isLoading={isLoadingEvents}
  error={eventsError}
  onRefresh={handleRefresh}
  onMeetingClick={handleMeetingClick}
/>
```

## Benefits

1. **Better User Experience** - Skeleton loading provides immediate visual feedback
2. **Maintainable Code** - Modular components are easier to test and modify
3. **Reusable Components** - Meeting cards can be used in other parts of the application
4. **Performance** - Optimized rendering with proper error boundaries
5. **Accessibility** - Proper ARIA labels and keyboard navigation support

## File Organization

```
src/app/dashboard/components/
├── CalenderMeetings.tsx
├── meetings/
│   ├── index.ts
│   ├── MeetingCard.tsx
│   ├── UpcomingMeetings.tsx
│   └── PastMeetings.tsx
├── skeletons/
│   ├── index.ts
│   └── MeetingSkeleton.tsx
└── index.ts
```