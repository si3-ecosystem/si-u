"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';
import { getResponsiveDisplayName, truncateUsername } from '@/lib/utils/username';

export function CommentTestPanel() {
  const { width, height, isMobile, isTablet, isDesktop, isSmallMobile } = useResponsive();

  const testUser = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'johnsmith123@example.com'
  };

  const testLongUser = {
    firstName: 'Alexander',
    lastName: 'Montgomery-Wellington',
    email: 'alexander.montgomery.wellington@verylongdomain.com'
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-3">Comment System Test Panel</h3>
      
      <div className="space-y-3 text-xs">
        <div>
          <strong>Screen Info:</strong>
          <div className="bg-gray-100 p-2 rounded text-xs">
            <div>Size: {width}x{height}</div>
            <div>Mobile: {isMobile ? '✅' : '❌'}</div>
            <div>Small Mobile: {isSmallMobile ? '✅' : '❌'}</div>
            <div>Tablet: {isTablet ? '✅' : '❌'}</div>
            <div>Desktop: {isDesktop ? '✅' : '❌'}</div>
          </div>
        </div>

        <div>
          <strong>Username Tests:</strong>
          <div className="bg-gray-100 p-2 rounded text-xs space-y-1">
            <div>
              <strong>Normal User:</strong>
              <div>Full: {getResponsiveDisplayName(testUser, false)}</div>
              <div>Mobile: {getResponsiveDisplayName(testUser, true)}</div>
              <div>Truncated: {truncateUsername('johnsmith123')}</div>
            </div>
            <div>
              <strong>Long User:</strong>
              <div>Full: {getResponsiveDisplayName(testLongUser, false)}</div>
              <div>Mobile: {getResponsiveDisplayName(testLongUser, true)}</div>
              <div>Truncated: {truncateUsername('alexander.montgomery.wellington')}</div>
            </div>
          </div>
        </div>

        <div>
          <strong>Responsive Classes:</strong>
          <div className="bg-gray-100 p-2 rounded text-xs">
            <div className={isSmallMobile ? "text-red-600" : "text-green-600"}>
              Small Mobile Styles: {isSmallMobile ? 'Active' : 'Inactive'}
            </div>
            <div className={isMobile ? "text-red-600" : "text-green-600"}>
              Mobile Styles: {isMobile ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          size="sm" 
          className="w-full"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
