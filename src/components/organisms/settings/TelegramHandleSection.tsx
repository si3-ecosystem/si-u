"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useProfile } from '@/hooks/useProfile';

interface FormValues {
  telegramHandle: string;
}

export function TelegramHandleSection() {
  const { profile, updateProfile, isUpdating } = useProfile();
  const defaultValue = useMemo(() => profile?.telegramHandle || '', [profile?.telegramHandle]);
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<FormValues>({
    defaultValues: { telegramHandle: defaultValue },
  });

  React.useEffect(() => {
    reset({ telegramHandle: defaultValue });
  }, [defaultValue, reset]);

  const onSubmit = (data: FormValues) => {
    const cleaned = data.telegramHandle.trim();
    updateProfile({ telegramHandle: cleaned || undefined });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl font-bold">Telegram (private)</CardTitle>
        <p className="text-gray-600 text-sm">Only you and admins can see this. It will not appear on your public profile.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="telegramHandle">Telegram handle</Label>
            <Input id="telegramHandle" placeholder="@yourhandle" {...register('telegramHandle')} />
          </div>
          <Button type="submit" disabled={!isDirty || isUpdating}>{isUpdating ? 'Saving...' : 'Save'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

