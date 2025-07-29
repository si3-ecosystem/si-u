"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CronJobStatus as CronJobStatusType } from '@/types/admin';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CronJobStatusProps {
  cronJobs: CronJobStatusType[];
  className?: string;
}

export function CronJobStatus({ cronJobs, className = '' }: CronJobStatusProps) {
  const getStatusIcon = (status: CronJobStatusType['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: CronJobStatusType['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">Success</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50">Failed</Badge>;
      case 'running':
        return <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">Running</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeUntilNext = (nextRun?: string) => {
    if (!nextRun) return 'Not scheduled';
    
    const now = new Date();
    const next = new Date(nextRun);
    const diffMs = next.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Overdue';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Cron Job Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cronJobs.map((job, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <div className="font-medium text-sm">{job.name}</div>
                  <div className="text-xs text-gray-500">
                    {job.message || 'No message'}
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                {getStatusBadge(job.status)}
                <div className="text-xs text-gray-500">
                  Last: {formatTime(job.lastRun)}
                </div>
                <div className="text-xs text-gray-500">
                  Next: {getTimeUntilNext(job.nextRun)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {cronJobs.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No cron jobs configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
