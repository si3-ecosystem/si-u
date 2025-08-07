"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CommentSection } from '@/components/organisms/comment/CommentSection';
import { ContentType, UserRole } from '@/types/comment';
import { cn } from '@/lib/utils';

interface ContentDetailLayoutProps {
  // Navigation
  backHref: string;
  backLabel?: string;
  
  // Content
  children: ReactNode;
  
  // Comments
  contentId: string;
  contentType: ContentType;
  userRole: UserRole;
  enableComments?: boolean;
  
  // Layout
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export function ContentDetailLayout({
  backHref,
  backLabel = 'Back',
  children,
  contentId,
  contentType,
  userRole,
  enableComments = true,
  maxWidth = 'xl',
  className = '',
}: ContentDetailLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      <div className="pb-16 pt-4 px-4 lg:px-14">
        {/* Back navigation */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        {/* Main content */}
        <div className={cn('mx-auto w-full', maxWidthClasses[maxWidth])}>
          {/* Content area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            {children}
          </div>

          {/* Comments section */}
          {enableComments && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CommentSection
                contentId={contentId}
                contentType={contentType}
                userRole={userRole}
                showStats={true}
                autoRefresh={false}
                maxDepth={3}
                pageSize={20}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
