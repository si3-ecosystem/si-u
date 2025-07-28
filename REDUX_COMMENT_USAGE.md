# Redux Comment System - Usage Guide

## ✅ All TypeScript Errors Fixed!

The Redux comment system is now fully functional with proper TypeScript typing. Here's how to use it:

## 🚀 Quick Start

### 1. Basic Comment Section

```tsx
import { CommentSection } from '@/components/organisms/comment/CommentSection';

function MyContentPage({ contentId }: { contentId: string }) {
  return (
    <div>
      {/* Your content */}
      <h1>My Content</h1>
      <p>Content body...</p>
      
      {/* Comments */}
      <CommentSection
        contentId={contentId}
        contentType="scholar_session"
        userRole="scholar"
        showStats={true}
        autoRefresh={false}
      />
    </div>
  );
}
```

### 2. Display Comment Count in Cards

```tsx
import { HighlightCard } from '@/components/molecules/cards/highlightCard';

function ContentCard({ item }: { item: any }) {
  return (
    <HighlightCard
      category={item.category?.title || ''}
      title={item.title}
      description={item.description}
      ctaText="Read More"
      ctaLink={`/content/${item._id}`}
      imageUrl={item.imageUrl}
      contentId={item._id} // 🔥 This enables Redux comment count
      publishedAt={item.date}
      author={item.author}
      showMetadata={true}
    />
  );
}
```

### 3. Access Comment Data with Hooks

```tsx
import { useReduxComments, useReduxCommentCount } from '@/hooks/useReduxComments';

function MyComponent({ contentId }: { contentId: string }) {
  // Get comment count only (lightweight)
  const { count } = useReduxCommentCount(contentId);
  
  // Get full comment data and actions
  const {
    comments,
    threadedComments,
    commentCount,
    commentStats,
    isExpanded,
    setComments,
    addComment,
    updateComment,
    deleteComment,
  } = useReduxComments(contentId);

  return (
    <div>
      <h3>Content Title</h3>
      <p>{count} comments</p>
      
      {/* Display threaded comments */}
      {threadedComments.map(comment => (
        <div key={comment._id}>
          {comment.content}
          {/* Render replies recursively */}
        </div>
      ))}
    </div>
  );
}
```

### 4. Global Notifications

```tsx
import { CommentNotifications } from '@/components/molecules/comment/CommentNotifications';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      
      {/* Global comment notifications */}
      <CommentNotifications />
    </div>
  );
}
```

## 🎯 Content Types

Use the correct `contentType` for your content:

```tsx
// For scholar sessions
contentType="scholar_session"

// For scholar ideas lab
contentType="scholar_ideas_lab"

// For guide sessions  
contentType="guide_session"

// For guide ideas lab
contentType="guide_ideas_lab"
```

## 🔧 Advanced Usage

### Custom Comment Management

```tsx
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addComment, setCommentStats } from '@/redux/slice/commentSlice';
import { selectCommentsForContent } from '@/redux/selectors/commentSelectors';

function AdvancedCommentComponent({ contentId }: { contentId: string }) {
  const dispatch = useAppDispatch();
  const comments = useAppSelector(state => selectCommentsForContent(state, contentId));

  const handleAddComment = (newComment: Comment) => {
    dispatch(addComment({ contentId, comment: newComment }));
  };

  const handleUpdateStats = (stats: CommentStats) => {
    dispatch(setCommentStats({ contentId, stats }));
  };

  // ... rest of component
}
```

### Bulk Comment Operations

```tsx
import { useAppDispatch } from '@/redux/store';
import { setComments, resetCommentState } from '@/redux/slice/commentSlice';

function BulkCommentManager() {
  const dispatch = useAppDispatch();

  const loadCommentsForContent = (contentId: string, comments: Comment[]) => {
    dispatch(setComments({ contentId, comments }));
  };

  const clearAllComments = () => {
    dispatch(resetCommentState());
  };

  // ... rest of component
}
```

## 📊 Analytics and Stats

```tsx
import { useAppSelector } from '@/redux/store';
import { 
  selectCommentAnalytics, 
  selectTotalCommentsAcrossContent 
} from '@/redux/selectors/commentSelectors';

function CommentAnalytics() {
  const analytics = useAppSelector(selectCommentAnalytics);
  const totalComments = useAppSelector(selectTotalCommentsAcrossContent);

  return (
    <div>
      <h3>Comment Analytics</h3>
      <p>Total Comments: {totalComments}</p>
      <p>Total Content: {analytics.totalContent}</p>
      <p>Average Comments per Content: {analytics.averageCommentsPerContent}</p>
      <p>Unique Users: {analytics.totalUniqueUsers}</p>
      <p>Content with Comments: {analytics.contentWithComments}</p>
    </div>
  );
}
```

## 🎨 UI State Management

```tsx
import { useReduxCommentItem } from '@/hooks/useReduxComments';

function CommentItem({ contentId, commentId }: { contentId: string; commentId: string }) {
  const {
    draft,
    isEditing,
    isReplying,
    isLoading,
    error,
    setDraft,
    startEditing,
    stopEditing,
    startReplying,
    stopReplying,
  } = useReduxCommentItem(contentId, commentId);

  return (
    <div>
      {isEditing ? (
        <textarea 
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <p>Comment content...</p>
      )}
      
      <button onClick={startEditing}>Edit</button>
      <button onClick={startReplying}>Reply</button>
    </div>
  );
}
```

## 🔄 Real-time Updates

The Redux system automatically handles:
- ✅ Comment count updates
- ✅ New comment notifications  
- ✅ Edit/delete notifications
- ✅ Optimistic UI updates
- ✅ Error handling and rollback

## 🎯 Migration from Context

If you had any Context-based components, simply replace:

```tsx
// Old (Context)
import { useCommentContext } from '@/contexts/CommentContext';
const { commentCounts, addNotification } = useCommentContext();

// New (Redux)
import { useReduxComments, useReduxCommentNotifications } from '@/hooks/useReduxComments';
const { commentCount } = useReduxComments(contentId);
const { addNotification } = useReduxCommentNotifications();
```

## 🚀 Performance Benefits

- ✅ **Memoized Selectors** - Only re-render when relevant data changes
- ✅ **Redux DevTools** - Debug comment state changes
- ✅ **Time Travel** - Replay comment actions
- ✅ **Persistence** - Comment state survives page refreshes
- ✅ **Global Access** - No prop drilling needed

The Redux comment system is now production-ready! 🎉
