"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RSVPStatusBadge } from '@/components/atoms/rsvp/RSVPStatusBadge';
import { AdminRSVPData } from '@/types/admin';
import { Mail, Trash2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RSVPTableProps {
  rsvps: AdminRSVPData[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onSendReminder: (rsvpIds: string[]) => void;
  onDelete: (rsvpIds: string[]) => void;
  onExport: (rsvpIds: string[]) => void;
  isLoading?: boolean;
  className?: string;
}

export function RSVPTable({
  rsvps,
  selectedIds,
  onSelectionChange,
  onSendReminder,
  onDelete,
  onExport,
  isLoading = false,
  className = '',
}: RSVPTableProps) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onSelectionChange(rsvps.map(rsvp => rsvp.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rsvpId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, rsvpId]);
    } else {
      onSelectionChange(selectedIds.filter(id => id !== rsvpId));
      setSelectAll(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Bulk Actions */}
      {hasSelection && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-800 font-medium">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSendReminder(selectedIds)}
              disabled={isLoading}
            >
              <Mail className="h-4 w-4 mr-1" />
              Send Reminder
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport(selectedIds)}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(selectedIds)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* RSVP Cards - Mobile Responsive */}
      <div className="space-y-4">
        {/* Header with Select All */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              aria-label="Select all"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({rsvps.length} RSVPs)
            </span>
          </div>
        </div>

        {/* RSVP Cards */}
        <div className="space-y-3">
          {rsvps.map((rsvp) => (
            <div key={rsvp.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.includes(rsvp.id)}
                  onCheckedChange={(checked) => handleSelectRow(rsvp.id, checked as boolean)}
                  aria-label={`Select ${rsvp.user.email}`}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">
                        {rsvp.user.firstName} {rsvp.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rsvp.user.email}
                      </div>
                    </div>
                    <RSVPStatusBadge status={rsvp.status} size="sm" />
                  </div>

                  {/* Session Info */}
                  <div className="mb-3">
                    <div className="font-medium text-sm text-gray-900 mb-1 truncate">
                      {rsvp.session.title}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>📍 {rsvp.session.location}</div>
                      <div>📅 RSVP: {formatDate(rsvp.createdAt)}</div>
                      <div>🕒 Session: {formatDate(rsvp.session.startTime)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendReminder([rsvp.id])}
                      disabled={isLoading}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Remind
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete([rsvp.id])}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {rsvps.length === 0 && (
          <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
            <Mail className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No RSVPs found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
