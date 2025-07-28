# SI3 Dashboard - Commenting System & Component Restructuring

## Overview

This implementation provides a comprehensive commenting system and restructured component architecture following React best practices. The system is built with TypeScript, follows atomic design principles, and includes a robust service layer for API interactions.

## Architecture

### 1. Service Layer (`src/lib/services/`)

**BaseService** - Foundation for all API services
- Automatic authentication handling
- Retry logic with exponential backoff
- Timeout management
- Error standardization
- Cookie and localStorage token management

**CommentService** - Specialized service for comment operations
- Full CRUD operations for comments
- Reaction management (likes/dislikes)
- Threaded comment support
- Statistics and analytics
- Batch operations

### 2. Type System (`src/types/`)

**api.ts** - Core API types
- Generic API response interfaces
- Pagination types
- Error handling types
- Service configuration types

**comment.ts** - Comment-specific types
- Comment data structures
- User and reaction types
- Query parameter interfaces
- UI component prop types

### 3. Custom Hooks (`src/hooks/`)

**useComments** - Primary hook for comment operations
- Data fetching with React Query
- CRUD operations with optimistic updates
- Pagination and loading states
- Error handling

**useCommentEngagement** - Reaction management
- Like/dislike functionality
- Optimistic updates for reactions
- User reaction state tracking

**useCommentThreads** - Thread management
- Hierarchical comment structure
- Thread expansion/collapse
- Navigation helpers
- Thread statistics

**useCommentState** - Advanced state management
- Local comment state with reducer
- Draft management
- Optimistic updates
- UI state tracking (editing, replying)

### 4. Component Architecture

#### Atoms (`src/components/atoms/comment/`)
- **CommentAvatar** - User avatar with fallbacks
- **CommentReactionButton** - Like/dislike buttons
- **CommentTimestamp** - Formatted timestamps with edit indicators

#### Molecules (`src/components/molecules/`)
- **CommentForm** - Reusable comment input form
- **CommentActions** - Action buttons and dropdown menu
- **CommentStats** - Comment statistics display
- **CommentNotifications** - Toast notifications
- **ContentHero** - Unified hero section component
- **ContentBanner** - Reusable banner component

#### Organisms (`src/components/organisms/`)
- **CommentItem** - Individual comment with threading
- **CommentSection** - Complete commenting interface
- **ContentListing** - Unified content listing with search/filter

#### Templates (`src/components/templates/`)
- **ContentDetailLayout** - Reusable detail page layout

### 5. Context Management (`src/contexts/`)

**CommentContext** - Global comment state
- Comment count tracking across pages
- Real-time update notifications
- UI state management
- Notification system

## Usage Examples

### Basic Comment Section

```tsx
import { CommentSection } from '@/components/organisms/comment/CommentSection';

function MyContentPage() {
  return (
    <CommentSection
      contentId="content-123"
      contentType="scholar_session"
      userRole="scholar"
      showStats={true}
      autoRefresh={false}
    />
  );
}
```

### Using Comment Hooks

```tsx
import { useComments } from '@/hooks/useComments';

function CustomCommentComponent() {
  const {
    comments,
    loading,
    createComment,
    updateComment,
    deleteComment,
  } = useComments({
    contentId: 'content-123',
    contentType: 'scholar_session',
    threaded: true,
  });

  const handleSubmit = async (content: string) => {
    await createComment(content);
  };

  // ... rest of component
}
```

### Content Detail Layout

```tsx
import { ContentDetailLayout } from '@/components/templates/ContentDetailLayout';
import { ContentHero } from '@/components/molecules/content/ContentHero';

function DetailPage({ content }) {
  return (
    <ContentDetailLayout
      backHref="/scholars/sessions"
      contentId={content._id}
      contentType="scholar_session"
      userRole="scholar"
    >
      <ContentHero
        title={content.title}
        description={content.description}
        publishedAt={content.date}
        image={content.image}
      />
      {/* Content body */}
    </ContentDetailLayout>
  );
}
```

### Using Comment Context

```tsx
import { CommentProvider, useCommentCount } from '@/contexts/CommentContext';

function App() {
  return (
    <CommentProvider>
      <MyApp />
    </CommentProvider>
  );
}

function ContentCard({ contentId }) {
  const { count } = useCommentCount(contentId);
  
  return (
    <div>
      <h3>Content Title</h3>
      <p>{count} comments</p>
    </div>
  );
}
```

## Migration Guide

### From Old to New Components

1. **Replace duplicate HeroSection components**:
   ```tsx
   // Old
   import { HeroSection } from '@/components/organisms/guides/ideas-lab/details/HeroSection';
   
   // New
   import { ContentHero } from '@/components/molecules/content/ContentHero';
   ```

2. **Replace Banner components**:
   ```tsx
   // Old
   import { Banner } from '@/components/organisms/guides/ideas-lab/Banner';
   
   // New
   import { ContentBanner } from '@/components/molecules/content/ContentBanner';
   ```

3. **Replace Highlights components**:
   ```tsx
   // Old
   import { Highlights } from '@/components/organisms/guides/ideas-lab/Highlights';
   
   // New
   import { ContentListing } from '@/components/organisms/content/ContentListing';
   ```

### Adding Comments to Existing Pages

1. **Wrap with CommentProvider**:
   ```tsx
   import { CommentProvider } from '@/contexts/CommentContext';
   
   export default function MyPage() {
     return (
       <CommentProvider>
         {/* Your existing content */}
         <CommentSection
           contentId={contentId}
           contentType="scholar_session"
           userRole={userRole}
         />
       </CommentProvider>
     );
   }
   ```

2. **Update HighlightCard usage**:
   ```tsx
   <HighlightCard
     // ... existing props
     commentCount={commentCount}
     publishedAt={publishedAt}
     author={author}
     showMetadata={true}
   />
   ```

## Features

### Comment System Features
- ✅ Threaded discussions with configurable depth
- ✅ Like/dislike reactions with optimistic updates
- ✅ Real-time comment statistics
- ✅ Draft saving and auto-recovery
- ✅ Rich text editing support
- ✅ Comment moderation (edit/delete)
- ✅ Role-based permissions
- ✅ Responsive design
- ✅ Accessibility compliance
- ✅ Error handling and retry logic

### Component Features
- ✅ Atomic design architecture
- ✅ TypeScript type safety
- ✅ Reusable across guides and scholars
- ✅ Consistent design system
- ✅ Performance optimized
- ✅ SEO friendly
- ✅ Mobile responsive

### Service Layer Features
- ✅ Automatic authentication
- ✅ Request/response interceptors
- ✅ Error standardization
- ✅ Retry logic
- ✅ Timeout handling
- ✅ Type-safe API calls

## Performance Considerations

1. **React Query Caching** - Comments are cached and automatically invalidated
2. **Optimistic Updates** - Immediate UI feedback for better UX
3. **Pagination** - Large comment threads are paginated
4. **Lazy Loading** - Components load only when needed
5. **Memoization** - Expensive calculations are memoized
6. **Virtual Scrolling** - For very large comment lists (future enhancement)

## Security

1. **Authentication** - All API calls include proper auth headers
2. **Authorization** - Role-based access control
3. **Input Validation** - Client and server-side validation
4. **XSS Protection** - Proper content sanitization
5. **Rate Limiting** - API rate limiting support

## Testing Strategy

1. **Unit Tests** - Individual component and hook testing
2. **Integration Tests** - Service layer and API integration
3. **E2E Tests** - Complete user workflows
4. **Accessibility Tests** - WCAG compliance testing
5. **Performance Tests** - Load and stress testing

## Next Steps

1. Implement the new components in production
2. Add WebSocket support for real-time updates
3. Implement comment moderation dashboard
4. Add rich text editor for comments
5. Implement comment search and filtering
6. Add comment analytics and insights
