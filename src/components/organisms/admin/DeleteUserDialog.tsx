"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { AdminUserService } from '@/services/adminUserService';
import { toast } from 'sonner';

interface DeleteUserDialogProps {
  userId: string;
  userEmail: string;
  userName: string;
  trigger: React.ReactNode;
  onDeleted?: () => void;
}

export function DeleteUserDialog({ userId, userEmail, userName, trigger, onDeleted }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reason, setReason] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const isValid = reason.trim().length > 0 && confirmEmail === userEmail;

  const handleDelete = async () => {
    if (!isValid) return;
    
    setIsDeleting(true);
    try {
      // Delete the user
      await AdminUserService.deleteUser(userId, {
        reason: reason.trim(),
        confirmEmail: confirmEmail.trim()
      });

      // Clear the cache
      await AdminUserService.clearUsersCache();

      toast.success('User permanently deleted');
      setOpen(false);
      setReason('');
      setConfirmEmail('');
      onDeleted?.();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setOpen(newOpen);
      if (!newOpen) {
        setReason('');
        setConfirmEmail('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>
      
      <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete User Permanently
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-red-800 mb-1">
                  This action cannot be undone!
                </p>
                <p className="text-red-700 break-words">
                  You are about to permanently delete <strong className="break-all">{userName}</strong> (<span className="break-all">{userEmail}</span>) from the database.
                  All user data will be lost forever.
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for deletion *</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for deleting this user..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isDeleting}
            />
          </div>

          {/* Email confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirmEmail">
              Type <code className="bg-gray-100 px-1 rounded text-xs sm:text-sm break-all">{userEmail}</code> to confirm *
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="Enter the user's email to confirm"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              disabled={isDeleting}
              className="text-xs sm:text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isValid || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Permanently
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
