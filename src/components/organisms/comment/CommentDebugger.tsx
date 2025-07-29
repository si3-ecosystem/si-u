"use client";

import React from 'react';
import { useAppSelector } from '@/redux/store';
import { selectCommentsForContent, selectThreadedCommentsForContent } from '@/redux/selectors/commentSelectors';

interface CommentDebuggerProps {
  contentId: string;
}

export function CommentDebugger({ contentId }: CommentDebuggerProps) {
  const flatComments = useAppSelector(state => selectCommentsForContent(state, contentId));
  const threadedComments = useAppSelector(state => selectThreadedCommentsForContent(state, contentId));
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-xs space-y-4">
      <h3 className="font-bold text-sm">Comment Debugger</h3>
      
      <div>
        <h4 className="font-semibold">Flat Comments ({flatComments.length}):</h4>
        <ul className="list-disc list-inside space-y-1">
          {flatComments.map(comment => (
            <li key={comment._id}>
              <span className="font-mono">{comment._id}</span> - 
              {comment.isReply ? (
                <span className="text-blue-600"> Reply to {comment.parentCommentId}</span>
              ) : (
                <span className="text-green-600"> Top Level</span>
              )}
              <span className="text-gray-600"> - &quot;{comment.content.substring(0, 30)}...&quot;</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold">Threaded Comments ({threadedComments.length}):</h4>
        <ul className="list-disc list-inside space-y-1">
          {threadedComments.map(comment => (
            <li key={comment._id}>
              <span className="font-mono">{comment._id}</span> - 
              <span className="text-purple-600"> {comment.replies?.length || 0} replies</span>
              <span className="text-gray-600"> - &quot;{comment.content.substring(0, 30)}...&quot;</span>
              {comment.replies && comment.replies.length > 0 && (
                <ul className="list-disc list-inside ml-4 mt-1">
                  {comment.replies.map(reply => (
                    <li key={reply._id} className="text-blue-600">
                      <span className="font-mono">{reply._id}</span> - 
                      <span className="text-gray-600">&quot;{reply.content.substring(0, 20)}...&quot;</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
