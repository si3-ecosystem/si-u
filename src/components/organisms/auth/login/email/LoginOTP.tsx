// "use client";

// import { useRouter } from "next/navigation";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import React, { useState, useRef, useEffect } from "react";

// import { cn } from "@/lib/utils";

// import { authService } from "@/lib/api/authService";

// interface LoginOTPProps {
//   email: string;
//   onBack: () => void;
//   onSuccess?: (userData: any) => void;
// }

// const LoginOTP: React.FC<LoginOTPProps> = ({ email, onBack, onSuccess }) => {
//   const router = useRouter();

//   const [error, setError] = useState<string>("");
//   const [isVerifying, setIsVerifying] = useState<boolean>(false);
//   const [isResending, setIsResending] = useState<boolean>(false);
//   const [resendMessage, setResendMessage] = useState<string>("");
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (value.length > 1) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;

//     setOtp(newOtp);
//     setError("");
//     setResendMessage("");

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();

//     const pastedData = e.clipboardData.getData("text").slice(0, 6);
//     const newOtp = [...otp];

//     for (let i = 0; i < pastedData.length; i++) {
//       if (i < 6 && /^\d$/.test(pastedData[i])) {
//         newOtp[i] = pastedData[i];
//       }
//     }

//     setOtp(newOtp);
//     setError("");
//     setResendMessage("");

//     const nextIndex = Math.min(pastedData.length, 5);
//     inputRefs.current[nextIndex]?.focus();
//   };

//   const handleSubmit = async () => {
//     const otpString = otp.join("");

//     if (otpString.length !== 6) {
//       setError("Please enter all 6 digits");
//       return;
//     }

//     setIsVerifying(true);
//     setError("");
//     setResendMessage("");

//     try {
//       const response = await authService.verifyEmailOTP(email, otpString);

//       if (onSuccess) {
//         onSuccess(response.data);
//       }

//       setIsRedirecting(true);

//       setTimeout(() => {
//         router.push("/");
//       }, 1000);
//     } catch (error: any) {
//       setError(error.message || "Invalid verification code. Please try again.");
//       setOtp(["", "", "", "", "", ""]);

//       inputRefs.current[0]?.focus();
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setIsResending(true);
//     setError("");
//     setResendMessage("");

//     try {
//       await authService.sendEmailOTP(email);
//       setResendMessage("New verification code sent to your email");
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();

//       // Clear resend message after 3 seconds
//       setTimeout(() => {
//         setResendMessage("");
//       }, 3000);
//     } catch (error: any) {
//       setError(error.message || "Failed to resend code. Please try again.");
//     } finally {
//       setIsResending(false);
//     }
//   };

//   const isComplete = otp.every((digit) => digit !== "");

//   return (
//     <div className="space-y-3.5">
//       <div className="text-center space-y-2">
//         <h2 className="text-xl font-medium md:text-2xl">
//           Enter Verification Code
//         </h2>

//         <p className="text-xs font-medium text-[#00000082] md:text-sm">
//           We sent a 6-digit code to {email}
//         </p>
//       </div>

//       <div className="flex justify-center gap-2 md:gap-3">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             type="text"
//             maxLength={1}
//             value={digit}
//             inputMode="numeric"
//             onPaste={handlePaste}
//             onKeyDown={(e) => handleKeyDown(index, e)}
//             ref={(el: HTMLInputElement | null) => {
//               inputRefs.current[index] = el;
//             }}
//             onChange={(e) =>
//               handleChange(index, e.target.value.replace(/\D/g, ""))
//             }
//             className={cn(
//               "w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-medium rounded-lg border-2 transition-colors",
//               digit ? "border-gray-400 bg-gray-50" : "border-gray-300",
//               error ? "border-red-300" : "",
//               isRedirecting ? "border-green-300" : "",
//               "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//             )}
//             disabled={isVerifying || isResending || isRedirecting}
//           />
//         ))}
//       </div>

//       {error && (
//         <p className="text-red-500 text-xs md:text-sm font-medium text-center">
//           {error}
//         </p>
//       )}

//       {resendMessage && (
//         <p className="text-green-600 text-xs md:text-sm font-medium text-center">
//           {resendMessage}
//         </p>
//       )}

//       <div className="space-y-3">
//         <button
//           onClick={handleSubmit}
//           disabled={!isComplete || isVerifying || isResending || isRedirecting}
//           className={cn(
//             "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
//             isComplete && !isVerifying && !isResending && !isRedirecting
//               ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
//               : "bg-gray-200 cursor-not-allowed opacity-60"
//           )}
//         >
//           {isVerifying ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
//               Verifying...
//             </div>
//           ) : isRedirecting ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
//               Redirecting...
//             </div>
//           ) : (
//             <>
//               Verify <ArrowRight className="w-4" />
//             </>
//           )}
//         </button>

//         <button
//           onClick={onBack}
//           disabled={isVerifying || isResending || isRedirecting}
//           className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60"
//         >
//           <ArrowLeft className="w-4" />
//           Back to Email
//         </button>
//       </div>

//       <div className="text-center space-y-2">
//         <p className="text-xs font-medium text-[#00000082]">
//           Didn&apos;t receive the code?{" "}
//           <button
//             onClick={handleResendOTP}
//             disabled={isVerifying || isResending || isRedirecting}
//             className="text-blue-600 hover:text-blue-800 underline disabled:opacity-60"
//           >
//             {isResending ? "Sending..." : "Resend"}
//           </button>
//         </p>

//         <p className="text-center text-xs font-medium text-[#00000082]">
//           Your journey to SI University continues with secure verification.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginOTP;

"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";
import { authService } from "@/lib/api/authService";

interface LoginOTPProps {
  email: string;
  onBack: () => void;
  onSuccess?: (userData: any) => void;
}

const OTP_LENGTH = 6;

const LoadingSpinner = ({ className }: { className?: string }) => (
  <div
    className={`border-2 border-gray-600 border-t-transparent rounded-full animate-spin ${className}`}
  />
);

const LoginOTP: React.FC<LoginOTPProps> = ({ email, onBack, onSuccess }) => {
  const router = useRouter();

  const [error, setError] = useState<string>("");

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>("");

  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setResendMessage("");
  }, []);

  const resetOtp = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return;

      const newOtp = [...otp];
      newOtp[index] = value;

      setOtp(newOtp);
      clearMessages();

      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, clearMessages]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
      const newOtp = [...otp];

      for (let i = 0; i < pastedData.length; i++) {
        if (i < OTP_LENGTH && /^\d$/.test(pastedData[i])) {
          newOtp[i] = pastedData[i];
        }
      }

      setOtp(newOtp);
      clearMessages();

      const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    },
    [otp, clearMessages]
  );

  const handleSubmit = useCallback(async () => {
    const otpString = otp.join("");

    if (otpString.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }

    setIsVerifying(true);
    clearMessages();

    try {
      const response = await authService.verifyEmailOTP(email, otpString);

      onSuccess?.(response.data);

      setIsRedirecting(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.");
      resetOtp();
    } finally {
      setIsVerifying(false);
    }
  }, [otp, email, onSuccess, router, clearMessages, resetOtp]);

  const handleResendOTP = useCallback(async () => {
    setIsResending(true);
    clearMessages();

    try {
      await authService.sendEmailOTP(email);
      setResendMessage("New verification code sent to your email");

      resetOtp();

      setTimeout(() => setResendMessage(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [email, clearMessages, resetOtp]);

  const isComplete = otp.every((digit) => digit !== "");
  const isDisabled = isVerifying || isResending || isRedirecting;

  const getSubmitButtonContent = () => {
    if (isVerifying) {
      return (
        <div className="flex items-center gap-2">
          <LoadingSpinner className="w-4 h-4" />
          Verifying...
        </div>
      );
    }

    if (isRedirecting) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          Redirecting...
        </div>
      );
    }

    return (
      <>
        Verify <ArrowRight className="w-4" />
      </>
    );
  };

  return (
    <div className="space-y-3.5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Enter Verification Code
        </h2>

        <p className="text-xs font-medium text-[#00000082] md:text-sm">
          We sent a {OTP_LENGTH}-digit code to {email}
        </p>
      </div>

      <div className="flex justify-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            inputMode="numeric"
            onPaste={handlePaste}
            disabled={isDisabled}
            aria-label={`Digit ${index + 1}`}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            onChange={(e) =>
              handleChange(index, e.target.value.replace(/\D/g, ""))
            }
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-medium rounded-lg border-2 transition-colors",
              digit ? "border-gray-400 bg-gray-50" : "border-gray-300",
              error ? "border-red-300" : "",
              isRedirecting ? "border-green-300" : "",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            )}
          />
        ))}
      </div>

      {error && (
        <p
          className="text-red-500 text-xs md:text-sm font-medium text-center"
          role="alert"
        >
          {error}
        </p>
      )}

      {resendMessage && (
        <p
          className="text-green-600 text-xs md:text-sm font-medium text-center"
          role="status"
        >
          {resendMessage}
        </p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!isComplete || isDisabled}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
            isComplete && !isDisabled
              ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
              : "bg-gray-200 cursor-not-allowed opacity-60"
          )}
          aria-label="Verify OTP code"
        >
          {getSubmitButtonContent()}
        </button>

        <button
          onClick={onBack}
          disabled={isDisabled}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60"
          aria-label="Go back to email input"
        >
          <ArrowLeft className="w-4" />
          Back to Email
        </button>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs font-medium text-[#00000082]">
          Didn&apos;t receive the code?{" "}
          <button
            onClick={handleResendOTP}
            disabled={isDisabled}
            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-60"
            aria-label="Resend verification code"
          >
            {isResending ? "Sending..." : "Resend"}
          </button>
        </p>

        <p className="text-center text-xs font-medium text-[#00000082]">
          Your journey to SI University continues with secure verification.
        </p>
      </div>
    </div>
  );
};

export default LoginOTP;
