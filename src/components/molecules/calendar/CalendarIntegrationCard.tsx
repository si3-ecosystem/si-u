"use client";

import React from 'react';
import { Calendar, Download, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { GuidesSession } from '@/types/siherguides/session';
import { cn } from '@/lib/utils';

interface CalendarIntegrationCardProps {
  session: GuidesSession;
  className?: string;
  showTitle?: boolean;
}

export function CalendarIntegrationCard({ 
  session, 
  className = '',
  showTitle = true 
}: CalendarIntegrationCardProps) {
  const { 
    addToGoogleCalendar, 
    addToAppleCalendar, 
    downloadICSFile,
    copyCalendarLink 
  } = useCalendarIntegration(session);

  const calendarOptions = [
    {
      name: 'Google Calendar',
      icon: Calendar,
      action: addToGoogleCalendar,
      description: 'Add to your Google Calendar',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Apple Calendar',
      icon: Calendar,
      action: addToAppleCalendar,
      description: 'Download .ics file - double-click to open in Calendar',
      color: 'bg-gray-600 hover:bg-gray-700',
    },
    {
      name: 'Outlook Calendar',
      icon: Calendar,
      action: () => copyCalendarLink('outlook'),
      description: 'Copy Outlook calendar link',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Download ICS',
      icon: Download,
      action: downloadICSFile,
      description: 'Download calendar file (.ics)',
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  return (
    <Card className={cn('border-blue-200 bg-blue-50', className)}>
      {showTitle && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="w-5 h-5" />
            Add to Your Calendar
          </CardTitle>
          <p className="text-blue-700 text-sm">
            Don&quot;t forget about this session! Choose your preferred calendar:
          </p>
        </CardHeader>
      )}
      
      <CardContent className="space-y-3">
        {calendarOptions.map((option) => (
          <Button
            key={option.name}
            onClick={option.action}
            variant="outline"
            className={cn(
              'w-full justify-start gap-3 h-auto py-3 px-4 text-white border-0',
              option.color
            )}
          >
            <option.icon className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">{option.name}</div>
              <div className="text-xs opacity-90">{option.description}</div>
            </div>
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </Button>
        ))}

        <div className="pt-2 border-t border-blue-200 space-y-1">
          <p className="text-xs text-blue-600 flex items-center gap-1">
            <Copy className="w-3 h-3" />
            Tip: After clicking 
            &quot;Add to Google Calendar&quot;, remember to click &quot;Save&quot; in the popup.
          </p>
          <p className="text-xs text-blue-600">
            📱 For Apple Calendar & ICS downloads: Double-click the downloaded file to add it to your calendar app.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for dropdowns
export function CalendarIntegrationCompact({ 
  session, 
  onAction 
}: { 
  session: GuidesSession;
  onAction?: () => void;
}) {
  const { 
    addToGoogleCalendar, 
    addToAppleCalendar, 
    downloadICSFile 
  } = useCalendarIntegration(session);

  const handleAction = (action: () => void) => {
    action();
    onAction?.();
  };

  return (
    <div className="space-y-1">
      <button
        onClick={() => handleAction(addToGoogleCalendar)}
        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
      >
        <Calendar className="w-5 h-5" />
        <span>Google Calendar</span>
        <ExternalLink className="w-4 h-4 ml-auto" />
      </button>

      <button
        onClick={() => handleAction(addToAppleCalendar)}
        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
      >
        <Calendar className="w-5 h-5" />
        <span>Apple iCal</span>
        <Download className="w-4 h-4 ml-auto" />
      </button>

      <button
        onClick={() => handleAction(downloadICSFile)}
        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span>Download ICS</span>
        <Download className="w-4 h-4 ml-auto" />
      </button>
    </div>
  );
}
