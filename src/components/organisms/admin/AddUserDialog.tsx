"use client";

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminUserService } from '@/services/adminUserService';
import { toast } from 'sonner';

interface AddUserDialogProps {
  onCreated?: () => void;
}

const AVAILABLE_ROLES = ['admin', 'guide', 'scholar', 'partner'] as const;

export function AddUserDialog({ onCreated }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['scholar']);

  const isValid = useMemo(() => {
    // Email required, username and wallet optional
    return /.+@.+\..+/.test(email);
  }, [email]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await AdminUserService.createUser({
        email: email.trim(),
        username: username.trim() || undefined,
        wallet_address: walletAddress.trim() || undefined,
        roles: selectedRoles,
      });
      toast.success('User created');
      setOpen(false);
      setEmail('');
      setUsername('');
      setWalletAddress('');
      setSelectedRoles(['scholar']);
      onCreated?.();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" />
          </div>
          <div>
            <Label htmlFor="username">Username (optional)</Label>
            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
          </div>
          <div>
            <Label htmlFor="wallet">Wallet Address (optional)</Label>
            <Input id="wallet" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="0x..." />
          </div>
          <div>
            <Label>Roles</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {AVAILABLE_ROLES.map(role => (
                <label key={role} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={selectedRoles.includes(role)} onCheckedChange={() => toggleRole(role)} />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>{isSubmitting ? 'Creating...' : 'Create User'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

