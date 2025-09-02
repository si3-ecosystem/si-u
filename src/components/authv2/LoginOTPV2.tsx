"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuthV2 } from '@/hooks/auth/useAuthV2';
import { cn } from '@/lib/utils';

interface Props {
  email: string;
  onBack: () => void;
}

const OTP_LENGTH = 6;

export default function LoginOTPV2({ email, onBack }: Props) {
  const router = useRouter();
  const { verifyEmail } = useAuthV2();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const clearMessages = useCallback(() => { setError(''); setResendMessage(''); }, []);
  const resetOtp = useCallback(() => { setOtp(Array(OTP_LENGTH).fill('')); inputRefs.current[0]?.focus(); }, []);

  const autoVerify = useCallback(async (code: string) => {
    if (code.length !== OTP_LENGTH || isVerifying) return;
    setIsVerifying(true);
    clearMessages();
    try {
      const ok = await verifyEmail(email, code);
      if (!ok) throw new Error('Invalid code');
      setIsRedirecting(true);
      setTimeout(() => router.push('/home'), 800);
    } catch (e: any) {
      setError(e?.message || 'Invalid verification code. Please try again.');
      resetOtp();
    } finally {
      setIsVerifying(false);
    }
  }, [email, verifyEmail, clearMessages, resetOtp, router, isVerifying]);

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value.replace(/\D/g, '');
    setOtp(next);
    clearMessages();
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    const code = next.join('');
    if (code.length === OTP_LENGTH) setTimeout(() => autoVerify(code), 50);
  }, [otp, clearMessages, autoVerify]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      if (i < OTP_LENGTH && /^\d$/.test(pasted[i])) next[i] = pasted[i];
    }
    setOtp(next);
    clearMessages();
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
    const code = next.join('');
    if (code.length === OTP_LENGTH) setTimeout(() => autoVerify(code), 50);
  }, [otp, clearMessages, autoVerify]);

  const handleSubmit = useCallback(async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) { setError(`Please enter all ${OTP_LENGTH} digits`); return; }
    await autoVerify(code);
  }, [otp, autoVerify]);

  const isComplete = otp.every((d) => d !== '');
  const isDisabled = isVerifying || isResending || isRedirecting;

  return (
    <div className="space-y-3.5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium md:text-2xl">Enter Verification Code</h2>
        <p className="text-xs font-medium text-[#00000082] md:text-sm">We sent a {OTP_LENGTH}-digit code to {email}</p>
      </div>

      <div className="flex justify-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <input key={index} type="text" maxLength={1} value={digit} inputMode="numeric" onPaste={handlePaste} disabled={isDisabled} aria-label={`Digit ${index + 1}`} onKeyDown={(e) => handleKeyDown(index, e)} ref={(el) => { inputRefs.current[index] = el; }} onChange={(e) => handleChange(index, e.target.value)} className={cn('w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-medium rounded-lg border-2 transition-colors', digit ? 'border-gray-400 bg-gray-50' : 'border-gray-300', error ? 'border-red-300' : '', isRedirecting ? 'border-green-300' : '', 'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200')} />
        ))}
      </div>

      {error && <p className="text-red-500 text-xs md:text-sm font-medium text-center" role="alert">{error}</p>}
      {resendMessage && <p className="text-green-600 text-xs md:text-sm font-medium text-center" role="status">{resendMessage}</p>}

      {isComplete && !isVerifying && !error && (
        <p className="text-blue-600 text-xs md:text-sm font-medium text-center">Code entered - verifying automatically...</p>
      )}

      <div className="space-y-3">
        <button onClick={handleSubmit} disabled={!isComplete || isDisabled} className={cn('flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors', isComplete && !isDisabled ? 'bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer' : 'bg-gray-200 cursor-not-allowed opacity-60')} aria-label="Verify OTP code">
          {isVerifying ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"/> Verifying...</div>) : isRedirecting ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"/> Redirecting...</div>) : (<><span>Verify</span> <ArrowRight className="w-4" /></>)}
        </button>
        <button onClick={onBack} disabled={isDisabled} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60" aria-label="Go back to email input">
          <ArrowLeft className="w-4" /> Back to Email
        </button>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-[#00000082]">Didn&apos;t receive the code? <span className="text-blue-600">Resend</span></p>
      </div>
    </div>
  );
}

