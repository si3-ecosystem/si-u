"use client";

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminUserService } from '@/services/adminUserService';
import { toast } from 'sonner';

interface EditUserRolesDialogProps {
  userId: string;
  currentRoles: string[];
  trigger: React.ReactNode;
  onUpdated?: () => void;
}

const AVAILABLE_ROLES = ['admin', 'guide', 'scholar', 'partner', 'team'] as const;

export function EditUserRolesDialog({ userId, currentRoles, trigger, onUpdated }: EditUserRolesDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles || ['scholar']);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await AdminUserService.updateUserRoles(userId, selectedRoles);
      toast.success('Roles updated');
      setOpen(false);
      onUpdated?.();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update roles');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Roles</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {AVAILABLE_ROLES.map(role => (
            <label key={role} className="flex items-center gap-2 text-sm">
              <Checkbox checked={selectedRoles.includes(role)} onCheckedChange={() => toggleRole(role)} />
              <span className="capitalize">{role ==='partner' ? 'Grow3dge' : role}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

