"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { NotificationService, NotificationSettings } from '@/services/notificationService';
import { useAppSelector } from '@/redux/store';

export function NotificationSection() {
  const currentUser = useAppSelector(state => state.user);
  const [settings, setSettings] = useState<NotificationSettings>(NotificationService.getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load notification settings on component mount
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  // Load settings from user data or API
  useEffect(() => {
    if (currentUser?.user?.notificationSettings) {
      setSettings(currentUser.user.notificationSettings);
      setIsLoading(false);
    }
  }, [currentUser?.user?.notificationSettings]);

  const loadNotificationSettings = async () => {
    // If we have notification settings from user profile, use them
    if (currentUser?.user?.notificationSettings) {
      console.log('Using existing notification settings from user profile');
      setSettings(currentUser.user.notificationSettings);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to get from the new endpoint
      try {
        const response = await NotificationService.getNotificationSettings();
        if (response.status === 'success') {
          setSettings(response.data);
          return;
        }
      } catch (apiError: any) {
        console.log('Notification API endpoint failed:', apiError);

        // Use defaults but don't show error if user is unverified
        if (apiError?.statusCode === 401) {
          console.log('User not verified, using default notification settings');
        }
      }

      // Use default settings
      setSettings(NotificationService.getDefaultSettings());

    } catch (error: any) {
      console.error('Failed to load notification settings:', error);

      // Use default settings as fallback
      setSettings(NotificationService.getDefaultSettings());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    const previousValue = settings[key];
    const displayNames = NotificationService.getSettingDisplayNames();
    const settingName = displayNames[key];

    // Optimistic update
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    setIsUpdating(key);

    try {
      // Try to update via API
      const response = await NotificationService.updateSingleSetting(key, value);

      if (response.status === 'success') {
        toast.success(`${settingName} ${value ? 'enabled' : 'disabled'}`);
      } else {
        throw new Error('Failed to update setting');
      }
    } catch (error: any) {
      console.error(`Failed to update ${key}:`, error);

      // For now, if API fails, just show a warning but keep the local change
      // This allows the UI to work even if the backend endpoints aren't ready
      if (error?.statusCode === 401) {
        toast.warning(`${settingName} ${value ? 'enabled' : 'disabled'} locally. Please verify your email to sync with server.`);
      } else {
        toast.warning(`${settingName} ${value ? 'enabled' : 'disabled'} locally. Server sync failed.`);
      }

      // Don't revert the change - keep it local for now
      console.log(`Setting ${key} updated locally to ${value}`);
    } finally {
      setIsUpdating(null);
    }
  };

  const settingDisplayNames = NotificationService.getSettingDisplayNames();
  const settingDescriptions = NotificationService.getSettingDescriptions();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading notification settings...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="ml-2 text-red-600">{error}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(Object.keys(settings) as Array<keyof NotificationSettings>).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{settingDisplayNames[key]}</p>
              <p className="text-sm text-gray-500">{settingDescriptions[key]}</p>
            </div>
            <div className="flex items-center gap-2">
              {isUpdating === key && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
              <Switch
                checked={settings[key]}
                onCheckedChange={(checked) => handleSettingChange(key, checked)}
                disabled={isUpdating === key}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
