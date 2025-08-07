"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  NotificationService,
  NotificationSettings,
} from "@/services/notificationService";
import { useAppSelector } from "@/redux/store";

export function NotificationSection() {
  const currentUser = useAppSelector((state) => state.user);
  const [settings, setSettings] = useState<NotificationSettings>(
    NotificationService.getDefaultSettings()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  useEffect(() => {
    if (currentUser?.user?.notificationSettings) {
      setSettings(currentUser.user.notificationSettings);
      setIsLoading(false);
    }
  }, [currentUser?.user?.notificationSettings]);

  const loadNotificationSettings = async () => {
    if (currentUser?.user?.notificationSettings) {
      setSettings(currentUser.user.notificationSettings);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      try {
        const response = await NotificationService.getNotificationSettings();
        if (response.status === "success" && response.data) {
          setSettings(response.data);
          return;
        }
      } catch (apiError: any) {
        if (apiError?.statusCode === 401) {
          console.log("User not verified, using default notification settings");
        }
      }

      setSettings(NotificationService.getDefaultSettings());
    } catch (error: any) {
      console.error("Failed to load notification settings:", error);

      setSettings(NotificationService.getDefaultSettings());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    const displayNames = NotificationService.getSettingDisplayNames();
    const settingName = displayNames[key];

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setIsUpdating(key);

    try {
      const response = await NotificationService.updateSingleSetting(
        key,
        value
      );

      if (response.status === "success") {
        toast.success(`${settingName} ${value ? "enabled" : "disabled"}`);
      } else {
        throw new Error("Failed to update setting");
      }
    } catch (error: any) {
      console.error(`Failed to update ${key}:`, error);

      if (error?.statusCode === 401) {
        toast.warning(
          `${settingName} ${
            value ? "enabled" : "disabled"
          } locally. Please verify your email to sync with server.`
        );
      } else {
        toast.warning(
          `${settingName} ${
            value ? "enabled" : "disabled"
          } locally. Server sync failed.`
        );
      }
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
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
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
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-bold">
          Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 border border-gray-200 p-4 rounded-lg  divide-gray-200 divide-y">
          {(Object.keys(settings) as Array<keyof NotificationSettings>).slice(0, 2).map(
            (key) => (
              <div key={key} className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-medium">{settingDisplayNames[key]}</p>
                  <p className="text-sm text-gray-500">
                    {settingDescriptions[key]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isUpdating === key && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                  <Switch
                    checked={settings[key]}
                    className=""
                    onCheckedChange={(checked) =>
                      handleSettingChange(key, checked)
                    }
                    disabled={isUpdating === key}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
