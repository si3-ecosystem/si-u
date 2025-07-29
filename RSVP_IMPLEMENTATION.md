# RSVP Functionality Implementation

## Overview
Simple RSVP functionality for upcoming sessions following Next.js best practices and atomic design principles.

## Architecture

### Components Structure
```
src/
├── components/
│   ├── atoms/rsvp/
│   │   ├── RSVPButton.tsx          # Interactive RSVP button
│   │   └── RSVPStatusBadge.tsx     # Status display badge
│   ├── molecules/rsvp/
│   │   └── RSVPCard.tsx            # Complete session card with RSVP
│   └── organisms/sessions/
│       └── UpcomingSessionsList.tsx # Sessions list container
├── hooks/
│   └── useRSVP.ts                  # TanStack Query hook
├── lib/server-actions/
│   └── rsvp.ts                     # Server actions
└── types/
    └── rsvp.ts                     # TypeScript interfaces
```

## Features

### RSVP Statuses
- **Attending** (green) - User will attend
- **Maybe** (yellow) - User might attend  
- **Not Attending** (red) - User won't attend
- **No Response** (gray) - No RSVP set

### Functionality
- ✅ Optimistic updates for immediate UI feedback
- ✅ Error handling with user notifications
- ✅ Loading states during operations
- ✅ Responsive design for mobile devices
- ✅ Accessibility features
- ✅ Real-time RSVP count display

## Usage

### Basic RSVP Button
```tsx
import { RSVPButton } from '@/components/atoms/rsvp/RSVPButton';
import { useRSVP } from '@/hooks/useRSVP';

function MyComponent({ sessionId }: { sessionId: string }) {
  const { rsvpStatus, isUpdating, updateRSVP } = useRSVP(sessionId);
  
  return (
    <RSVPButton
      status={rsvpStatus}
      onStatusChange={updateRSVP}
      isLoading={isUpdating}
    />
  );
}
```

### Complete Session Card
```tsx
import { RSVPCard } from '@/components/molecules/rsvp/RSVPCard';

function SessionsList({ sessions }: { sessions: SessionWithRSVP[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <RSVPCard
          key={session.id}
          session={session}
          showDetails={true}
        />
      ))}
    </div>
  );
}
```

## Integration

### Current Integration
The RSVP functionality is integrated into:
- `/guides/sessions` - Upcoming sessions tab now shows RSVP cards
- Existing `WorkShops` component updated to use `RSVPCard`

### Server Actions
```typescript
// Update RSVP status
await updateRSVP(sessionId, 'attending');

// Get RSVP status  
const response = await getRSVPStatus(sessionId);
```

## API Endpoints

### POST `/api/sessions/[sessionId]/rsvp`
Update RSVP status for a session.

**Body:**
```json
{
  "userId": "user-id",
  "status": "attending" | "maybe" | "not_attending" | null
}
```

### GET `/api/sessions/[sessionId]/rsvp/[userId]`
Get RSVP status for a user and session.

## Customization

### Button Sizes
```tsx
<RSVPButton size="sm" />   // Small
<RSVPButton size="md" />   // Medium (default)
<RSVPButton size="lg" />   // Large
```

### Status Badge Variants
```tsx
<RSVPStatusBadge status="attending" count={5} />
<RSVPStatusBadge status="maybe" showIcon={false} />
<RSVPStatusBadge size="sm" />
```

## Next Steps

1. **Replace Mock API** - Update server actions to use real backend API
2. **Add Authentication** - Integrate with actual user authentication system
3. **Real-time Updates** - Add WebSocket support for live RSVP updates
4. **Email Notifications** - Send RSVP confirmations and reminders
5. **Calendar Integration** - Add to calendar functionality
6. **Capacity Management** - Handle session capacity limits

## File Limits Compliance

All components follow the 150-line limit:
- RSVPButton.tsx: ~90 lines
- RSVPStatusBadge.tsx: ~70 lines  
- RSVPCard.tsx: ~140 lines
- useRSVP.ts: ~120 lines
- Server actions: ~80 lines each

## Dependencies

- TanStack Query for state management
- Sonner for toast notifications
- Lucide React for icons
- Tailwind CSS for styling
- shadcn/ui components
