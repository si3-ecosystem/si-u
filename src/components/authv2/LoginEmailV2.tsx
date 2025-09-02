"use client";

import React, { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthV2 } from '@/hooks/auth/useAuthV2';

interface Props {
  onSubmit: (email: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginEmailV2({ onSubmit }: Props) {
  const { startEmail } = useAuthV2();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return setError('Please enter your email');
    if (!EMAIL_REGEX.test(trimmed)) return setError('Please enter a valid email');
    setLoading(true);
    try {
      await startEmail(trimmed);
      onSubmit(trimmed);
    } catch (err: any) {
      setError(err?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }, [email, onSubmit, startEmail]);

  const disabled = loading || !email.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="relative mt-2 border">
        <input
          id="email"
          type="email"
          value={email}
          disabled={loading}
          placeholder="youremail@si3.space"
          onChange={handleChange}
          className={cn(
            'md:text-md w-full rounded-lg p-2 text-lg md:p-3 md:text-sm transition-colors',
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
            'focus:outline-none focus:ring-2'
          )}
          autoComplete="email"
          aria-describedby={error ? 'email-error' : undefined}
        />
      </div>
      {error && (
        <p id="email-error" className="text-red-500 text-xs md:text-sm font-medium" role="alert">{error}</p>
      )}
      <button type="submit" disabled={disabled} className={cn('flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors', !disabled ? 'bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer' : 'bg-gray-200 cursor-not-allowed opacity-60')} aria-label="Send verification code to email">
        {loading ? 'Sending…' : (<><span>Continue</span> <ArrowRight className="w-4" /></>)}
      </button>
      <p className="text-center text-xs font-medium text-[#00000082]">Welcome onboard as we set sail towards a brighter new economy and future.</p>
    </form>
  );
}

