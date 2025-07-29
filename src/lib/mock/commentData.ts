import { Comment, CommentStats, User } from '@/types/comment';

// Mock users for testing
const mockUsers: User[] = [
  {
    _id: 'user-1',
    email: 'john.doe@example.com',
    roles: ['scholar'],
    firstName: 'John',
    lastName: 'Doe',
    avatar: undefined,
  },
  {
    _id: 'user-2',
    email: 'jane.smith@example.com',
    roles: ['guide'],
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: undefined,
  },
  {
    _id: 'user-3',
    email: 'anonymous@example.com',
    roles: ['scholar'],
    firstName: undefined,
    lastName: undefined,
    avatar: undefined,
  },
];

// Generate mock comment data
export function generateMockComments(contentId: string, count: number = 5): Comment[] {
  const comments: Comment[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = mockUsers[i % mockUsers.length];
    const comment: Comment = {
      _id: `comment-${i + 1}`,
      contentId,
      contentType: 'scholar_session',
      content: `This is a mock comment #${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      userId: user._id,
      user: user,
      parentCommentId: undefined,
      isReply: false,
      replyCount: Math.floor(Math.random() * 3),
      reactions: [],
      likeCount: Math.floor(Math.random() * 10),
      dislikeCount: Math.floor(Math.random() * 2),
      isDeleted: false,
      isEdited: Math.random() > 0.8,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };
    
    comments.push(comment);
    
    // Add some replies
    if (comment.replyCount > 0) {
      for (let j = 0; j < comment.replyCount; j++) {
        const replyUser = mockUsers[(i + j + 1) % mockUsers.length];
        const reply: Comment = {
          _id: `reply-${i + 1}-${j + 1}`,
          contentId,
          contentType: 'scholar_session',
          content: `This is a reply to comment #${i + 1}. Great point!`,
          userId: replyUser._id,
          user: replyUser,
          parentCommentId: comment._id,
          isReply: true,
          replyCount: 0,
          reactions: [],
          likeCount: Math.floor(Math.random() * 5),
          dislikeCount: Math.floor(Math.random() * 1),
          isDeleted: false,
          isEdited: false,
          createdAt: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [],
        };
        
        comments.push(reply);
      }
    }
  }
  
  return comments;
}

// Generate mock comment stats
export function generateMockCommentStats(contentId: string): CommentStats {
  const comments = generateMockComments(contentId);
  const topLevel = comments.filter(c => !c.isReply);
  const replies = comments.filter(c => c.isReply);
  
  return {
    totalComments: comments.length,
    totalReplies: replies.length,
    totalTopLevel: topLevel.length,
    uniqueUserCount: new Set(comments.map(c => c.userId)).size,
    latestComment: comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt || new Date().toISOString(),
    oldestComment: comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]?.createdAt || new Date().toISOString(),
  };
}

// Mock comment with missing user data (for testing error handling)
export function generateCommentWithMissingUser(contentId: string): Comment {
  return {
    _id: 'comment-no-user',
    contentId,
    contentType: 'scholar_session',
    content: 'This comment has no user data attached.',
    userId: 'unknown-user',
    user: undefined, // This will test our error handling
    parentCommentId: undefined,
    isReply: false,
    replyCount: 0,
    reactions: [],
    likeCount: 0,
    dislikeCount: 0,
    isDeleted: false,
    isEdited: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
  };
}
