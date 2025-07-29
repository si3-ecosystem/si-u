"use client";

import React, { useEffect } from 'react';
import { CommentSectionTest } from '@/components/organisms/comment/CommentSectionTest';
import { useReduxComments } from '@/hooks/useReduxComments';
import { Comment } from '@/types/comment';

export default function TestCommentsPage() {
  const contentId = 'test-content-123';
  const { setComments, comments, threadedComments } = useReduxComments(contentId);

  useEffect(() => {
    // Create test comments with replies
    const testComments: Comment[] = [
      {
        _id: 'comment-1',
        contentId,
        contentType: 'scholar_session',
        content: 'This is the first comment',
        userId: 'user-1',
        user: {
          _id: 'user-1',
          email: 'user1@example.com',
          roles: ['scholar'],
          firstName: 'John',
          lastName: 'Doe',
        },
        parentCommentId: undefined,
        isReply: false,
        replyCount: 2,
        reactions: [],
        likeCount: 5,
        dislikeCount: 0,
        isDeleted: false,
        isEdited: false,
        createdAt: new Date(Date.now() - 60000).toISOString(),
        updatedAt: new Date(Date.now() - 60000).toISOString(),
        replies: [],
      },
      {
        _id: 'reply-1',
        contentId,
        contentType: 'scholar_session',
        content: 'This is a reply to the first comment',
        userId: 'user-2',
        user: {
          _id: 'user-2',
          email: 'user2@example.com',
          roles: ['guide'],
          firstName: 'Jane',
          lastName: 'Smith',
        },
        parentCommentId: 'comment-1',
        isReply: true,
        replyCount: 0,
        reactions: [],
        likeCount: 2,
        dislikeCount: 0,
        isDeleted: false,
        isEdited: false,
        createdAt: new Date(Date.now() - 30000).toISOString(),
        updatedAt: new Date(Date.now() - 30000).toISOString(),
        replies: [],
      },
      {
        _id: 'reply-2',
        contentId,
        contentType: 'scholar_session',
        content: 'This is another reply to the first comment',
        userId: 'user-3',
        user: {
          _id: 'user-3',
          email: 'user3@example.com',
          roles: ['scholar'],
          firstName: 'Bob',
          lastName: 'Johnson',
        },
        parentCommentId: 'comment-1',
        isReply: true,
        replyCount: 0,
        reactions: [],
        likeCount: 1,
        dislikeCount: 0,
        isDeleted: false,
        isEdited: false,
        createdAt: new Date(Date.now() - 15000).toISOString(),
        updatedAt: new Date(Date.now() - 15000).toISOString(),
        replies: [],
      },
      {
        _id: 'comment-2',
        contentId,
        contentType: 'scholar_session',
        content: 'This is the second top-level comment',
        userId: 'user-4',
        user: {
          _id: 'user-4',
          email: 'user4@example.com',
          roles: ['scholar'],
          firstName: 'Alice',
          lastName: 'Wilson',
        },
        parentCommentId: undefined,
        isReply: false,
        replyCount: 0,
        reactions: [],
        likeCount: 3,
        dislikeCount: 1,
        isDeleted: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: [],
      },
    ];

    setComments(testComments);
  }, [setComments, contentId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Comment System Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Total Comments:</strong> {comments.length}</p>
            <p><strong>Threaded Comments:</strong> {threadedComments.length}</p>
            
            <div className="mt-4">
              <h3 className="font-medium">Flat Comments:</h3>
              <ul className="list-disc list-inside">
                {comments.map(comment => (
                  <li key={comment._id}>
                    {comment._id} - {comment.isReply ? `Reply to ${comment.parentCommentId}` : 'Top Level'}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">Threaded Structure:</h3>
              <ul className="list-disc list-inside">
                {threadedComments.map(comment => (
                  <li key={comment._id}>
                    {comment._id} - {comment.replies?.length || 0} replies
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Comment Section</h2>
          <CommentSectionTest
            contentId={contentId}
            contentType="scholar_session"
            userRole="scholar"
          />
        </div>
      </div>
    </div>
  );
}
