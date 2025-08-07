"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileEditForm } from '@/components/organisms/profile/ProfileEditForm';
import { AccountWalletSection } from './AccountWalletSection';
import { SupportSection } from './SupportSection';
import { NotificationSection } from './NotificationSection';
import { LogOut } from 'lucide-react';

export default function Settings() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleDisconnectWallet = () => {
    console.log('Disconnect wallet clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your wallet, preference, and connected accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 overflow-hidden">
          <div className="lg:col-span-1 space-y-6">
            <AccountWalletSection onDisconnectWallet={handleDisconnectWallet} />
            <SupportSection />
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <NotificationSection />
            <Card>
              <CardContent className="pt-6">
                <ProfileEditForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
