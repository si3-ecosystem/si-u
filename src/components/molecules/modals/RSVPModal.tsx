"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RSVPForm } from '../forms/RSVPForm';
import { GuidesSession } from '@/types/siherguides/session';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: GuidesSession;
}

export function RSVPModal({ isOpen, onClose, session }: RSVPModalProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>RSVP for Session</DialogTitle>
        </DialogHeader>
        
        <RSVPForm
          session={session}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
