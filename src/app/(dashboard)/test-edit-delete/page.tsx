"use client";

import React, { useEffect } from 'react';
import { OptimizedCommentSection } from '@/components/organisms/comment/OptimizedCommentSection';
import { useAppDispatch } from '@/redux/store';
import { setUser, setConnected } from '@/redux/slice/userSlice';
import { Button } from '@/components/ui/button';

export default function TestEditDeletePage() {
  const dispatch = useAppDispatch();

  // Simulate different user scenarios
  const simulateUser1 = () => {
    dispatch(setUser({
      user: {
        _id: 'user-1',
        id: 'user-1',
        email: 'user1@example.com',
        roles: ['scholar'],
        firstName: 'John',
        lastName: 'Doe',
      }
    }));
    dispatch(setConnected(true));
  };

  const simulateUser2 = () => {
    dispatch(setUser({
      user: {
        _id: 'user-2', 
        id: 'user-2',
        email: 'user2@example.com',
        roles: ['guide'],
        firstName: 'Jane',
        lastName: 'Smith',
      }
    }));
    dispatch(setConnected(true));
  };

  const simulateUserWithDifferentStructure = () => {
    dispatch(setUser({
      _id: 'user-3',
      id: 'user-3', 
      email: 'user3@example.com',
      roles: ['scholar'],
      firstName: 'Bob',
      lastName: 'Johnson',
    }));
    dispatch(setConnected(true));
  };

  const clearUser = () => {
    dispatch(setUser({}));
    dispatch(setConnected(false));
  };

  // Set default user on mount
  useEffect(() => {
    simulateUser1();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Test Edit/Delete Functionality</h1>
        <p className="text-gray-600 mb-6">
          This page tests the comment edit and delete functionality with different user scenarios.
          Check the browser console for debug information about user permissions.
        </p>
        
        <div className="flex gap-2 mb-6">
          <Button onClick={simulateUser1} variant="outline" size="sm">
            Login as User 1 (user-1)
          </Button>
          <Button onClick={simulateUser2} variant="outline" size="sm">
            Login as User 2 (user-2)
          </Button>
          <Button onClick={simulateUserWithDifferentStructure} variant="outline" size="sm">
            Login as User 3 (different structure)
          </Button>
          <Button onClick={clearUser} variant="outline" size="sm">
            Logout
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Try logging in as different users using the buttons above</li>
            <li>Create some comments</li>
            <li>Try to edit/delete comments you created vs comments from other users</li>
            <li>Check the browser console for permission debug logs</li>
            <li>You should only see edit/delete options for your own comments</li>
          </ol>
        </div>
      </div>

      <OptimizedCommentSection
        contentId="test-edit-delete-content"
        contentType="scholar_session"
        userRole="scholar"
        showStats={true}
        maxDepth={2}
        pageSize={20}
        className="bg-white border rounded-lg p-6"
      />
    </div>
  );
}
