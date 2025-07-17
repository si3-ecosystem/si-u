// "use client";

// import { cn } from "@/lib/utils";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import React, { useState, useRef, useEffect } from "react";

// interface LoginOTPProps {
//   email: string;
//   onBack: () => void;
//   onVerify: (otpCode: string) => Promise<void>;
// }

// const LoginOTP: React.FC<LoginOTPProps> = ({ email, onBack, onVerify }) => {
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

//   const [error, setError] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     // Focus on first input when component mounts
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (value.length > 1) return; // Prevent multiple characters

//     const newOtp = [...otp];
//     newOtp[index] = value;

//     setError("");
//     setOtp(newOtp);

//     // Auto-focus next input
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

//     // Focus on the next empty input or the last input
//     const nextIndex = Math.min(pastedData.length, 5);
//     inputRefs.current[nextIndex]?.focus();
//   };

//   const handleSubmit = async () => {
//     const otpString = otp.join("");

//     if (otpString.length !== 6) {
//       setError("Please enter all 6 digits");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       await onVerify(otpString);
//     } catch (error) {
//       setError("Invalid verification code. Please try again.");
//       console.error("OTP verification failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = () => {
//     // Reset OTP inputs
//     setOtp(["", "", "", "", "", ""]);
//     setError("");

//     inputRefs.current[0]?.focus();
//     // Add your resend logic here
//     console.log("Resending OTP to:", email);
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
//             disabled={isLoading}
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
//               "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//             )}
//           />
//         ))}
//       </div>

//       {error && (
//         <p className="text-red-500 text-xs md:text-sm font-medium text-center">
//           {error}
//         </p>
//       )}

//       <div className="space-y-3">
//         <button
//           onClick={handleSubmit}
//           disabled={!isComplete || isLoading}
//           className={cn(
//             "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
//             isComplete && !isLoading
//               ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
//               : "bg-gray-200 cursor-not-allowed opacity-60"
//           )}
//         >
//           {isLoading ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
//               Verifying...
//             </div>
//           ) : (
//             <>
//               Verify <ArrowRight className="w-4" />
//             </>
//           )}
//         </button>

//         <button
//           onClick={onBack}
//           disabled={isLoading}
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
//             disabled={isLoading}
//             className="text-blue-600 hover:text-blue-800 underline disabled:opacity-60"
//           >
//             Resend
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

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import { authService } from "@/lib/api/authService";

// interface LoginOTPProps {
//   email: string;
//   onBack: () => void;
//   onVerify: (otpCode: string) => Promise<void>;
//   onSuccess?: (userData: any) => void;
// }

// const LoginOTP: React.FC<LoginOTPProps> = ({
//   email,
//   onBack,
//   onVerify,
//   onSuccess,
// }) => {
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isResending, setIsResending] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     // Focus on first input when component mounts
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (value.length > 1) return; // Prevent multiple characters

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setError(""); // Clear error when user types

//     // Auto-focus next input
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

//     // Focus on the next empty input or the last input
//     const nextIndex = Math.min(pastedData.length, 5);
//     inputRefs.current[nextIndex]?.focus();
//   };

//   const handleSubmit = async () => {
//     console.log("OTP submitted:");
//     const otpString = otp.join("");
//     if (otpString.length !== 6) {
//       setError("Please enter all 6 digits");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       // Call the API to verify OTP
//       const response = await authService.verifyEmailOTP(email, otpString);

//       setSuccessMessage(response.message || "Login successful!");

//       // Call parent component's onVerify
//       await onVerify(otpString);

//       // Call onSuccess with user data
//       if (onSuccess) {
//         onSuccess(response.data);
//       }

//       // Redirect after successful login
//       setTimeout(() => {
//         window.location.href = "/dashboard"; // Adjust redirect URL as needed
//       }, 1500);
//     } catch (error: any) {
//       const errorMessage =
//         error.message || "Invalid verification code. Please try again.";
//       setError(errorMessage);
//       console.error("OTP verification failed:", error);

//       // Clear OTP on error
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setIsResending(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       // Call the API to resend OTP
//       const response = await authService.sendEmailOTP(email);

//       console.log("OTP resent successfully:", response.message);
//       setSuccessMessage("New verification code sent to your email");

//       // Reset OTP inputs
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } catch (error: any) {
//       const errorMessage =
//         error.message || "Failed to resend code. Please try again.";
//       setError(errorMessage);
//       console.error("Resend OTP failed:", error);
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
//             ref={(el: HTMLInputElement | null) => {
//               inputRefs.current[index] = el;
//             }}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={(e) =>
//               handleChange(index, e.target.value.replace(/\D/g, ""))
//             }
//             onKeyDown={(e) => handleKeyDown(index, e)}
//             onPaste={handlePaste}
//             className={cn(
//               "w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-medium rounded-lg border-2 transition-colors",
//               digit ? "border-gray-400 bg-gray-50" : "border-gray-300",
//               error ? "border-red-300" : "",
//               successMessage ? "border-green-300" : "",
//               "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//             )}
//             disabled={isLoading || isResending}
//           />
//         ))}
//       </div>

//       {error && (
//         <p className="text-red-500 text-xs md:text-sm font-medium text-center">
//           {error}
//         </p>
//       )}

//       {successMessage && (
//         <p className="text-green-600 text-xs md:text-sm font-medium text-center">
//           {successMessage}
//         </p>
//       )}

//       <div className="space-y-3">
//         <button
//           onClick={handleSubmit}
//           disabled={!isComplete || isLoading || isResending}
//           className={cn(
//             "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
//             isComplete && !isLoading && !isResending
//               ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
//               : "bg-gray-200 cursor-not-allowed opacity-60"
//           )}
//         >
//           {isLoading ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
//               Verifying...
//             </div>
//           ) : successMessage ? (
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
//           disabled={isLoading || isResending}
//           className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60"
//         >
//           <ArrowLeft className="w-4" />
//           Back to Email
//         </button>
//       </div>

//       <div className="text-center space-y-2">
//         <p className="text-xs font-medium text-[#00000082]">
//           Didn't receive the code?{" "}
//           <button
//             onClick={handleResendOTP}
//             disabled={isLoading || isResending}
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

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import { authService } from "@/lib/api/authService";

// interface LoginOTPProps {
//   email: string;
//   onBack: () => void;
//   onVerify: (otpCode: string) => Promise<void>;
//   onSuccess?: (userData: any) => void;
// }

// const LoginOTP: React.FC<LoginOTPProps> = ({
//   email,
//   onBack,
//   onVerify,
//   onSuccess,
// }) => {
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isResending, setIsResending] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     // Focus on first input when component mounts
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   const handleChange = (index: number, value: string) => {
//     if (value.length > 1) return; // Prevent multiple characters

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setError(""); // Clear error when user types

//     // Auto-focus next input
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

//     // Focus on the next empty input or the last input
//     const nextIndex = Math.min(pastedData.length, 5);
//     inputRefs.current[nextIndex]?.focus();
//   };

//   const handleSubmit = async () => {
//     const otpString = otp.join("");
//     if (otpString.length !== 6) {
//       setError("Please enter all 6 digits");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       // Call the API to verify OTP
//       const response = await authService.verifyEmailOTP(email, otpString);

//       console.log("OTP verified successfully:", response);
//       setSuccessMessage(response.message || "Login successful!");

//       // Call parent component's onVerify
//       await onVerify(otpString);

//       // Call onSuccess with user data
//       if (onSuccess) {
//         onSuccess(response.data);
//       }

//       // Redirect after successful login
//       setTimeout(() => {
//         window.location.href = "/dashboard"; // Adjust redirect URL as needed
//       }, 1500);
//     } catch (error: any) {
//       const errorMessage =
//         error.message || "Invalid verification code. Please try again.";
//       setError(errorMessage);
//       console.error("OTP verification failed:", error);

//       // Clear OTP on error
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setIsResending(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       // Call the API to resend OTP
//       const response = await authService.sendEmailOTP(email);

//       console.log("OTP resent successfully:", response.message);
//       setSuccessMessage("New verification code sent to your email");

//       // Reset OTP inputs
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } catch (error: any) {
//       const errorMessage =
//         error.message || "Failed to resend code. Please try again.";
//       setError(errorMessage);
//       console.error("Resend OTP failed:", error);
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
//             ref={(el: HTMLInputElement | null) => {
//               inputRefs.current[index] = el;
//             }}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={(e) =>
//               handleChange(index, e.target.value.replace(/\D/g, ""))
//             }
//             onKeyDown={(e) => handleKeyDown(index, e)}
//             onPaste={handlePaste}
//             className={cn(
//               "w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-medium rounded-lg border-2 transition-colors",
//               digit ? "border-gray-400 bg-gray-50" : "border-gray-300",
//               error ? "border-red-300" : "",
//               successMessage ? "border-green-300" : "",
//               "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//             )}
//             disabled={isLoading || isResending}
//           />
//         ))}
//       </div>

//       {error && (
//         <p className="text-red-500 text-xs md:text-sm font-medium text-center">
//           {error}
//         </p>
//       )}

//       {successMessage && (
//         <p className="text-green-600 text-xs md:text-sm font-medium text-center">
//           {successMessage}
//         </p>
//       )}

//       <div className="space-y-3">
//         <button
//           onClick={handleSubmit}
//           disabled={!isComplete || isLoading || isResending}
//           className={cn(
//             "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
//             isComplete && !isLoading && !isResending
//               ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
//               : "bg-gray-200 cursor-not-allowed opacity-60"
//           )}
//         >
//           {isLoading ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
//               Verifying...
//             </div>
//           ) : successMessage ? (
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
//           disabled={isLoading || isResending}
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
//             disabled={isLoading || isResending}
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
import React, { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

import { authService } from "@/lib/api/authService";

interface LoginOTPProps {
  email: string;
  onBack: () => void;
  onSuccess?: (userData: any) => void;
}

const LoginOTP: React.FC<LoginOTPProps> = ({ email, onBack, onSuccess }) => {
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");
    setResendMessage("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6 && /^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
    setError("");
    setResendMessage("");

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");
    setResendMessage("");

    try {
      const response = await authService.verifyEmailOTP(email, otpString);

      if (onSuccess) {
        onSuccess(response.data);
      }

      setIsRedirecting(true);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.");
      setOtp(["", "", "", "", "", ""]);

      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");
    setResendMessage("");

    try {
      await authService.sendEmailOTP(email);
      setResendMessage("New verification code sent to your email");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Clear resend message after 3 seconds
      setTimeout(() => {
        setResendMessage("");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="space-y-3.5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-medium md:text-2xl">
          Enter Verification Code
        </h2>

        <p className="text-xs font-medium text-[#00000082] md:text-sm">
          We sent a 6-digit code to {email}
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
            disabled={isVerifying || isResending || isRedirecting}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-xs md:text-sm font-medium text-center">
          {error}
        </p>
      )}

      {resendMessage && (
        <p className="text-green-600 text-xs md:text-sm font-medium text-center">
          {resendMessage}
        </p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!isComplete || isVerifying || isResending || isRedirecting}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
            isComplete && !isVerifying && !isResending && !isRedirecting
              ? "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
              : "bg-gray-200 cursor-not-allowed opacity-60"
          )}
        >
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          ) : isRedirecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              Redirecting...
            </div>
          ) : (
            <>
              Verify <ArrowRight className="w-4" />
            </>
          )}
        </button>

        <button
          onClick={onBack}
          disabled={isVerifying || isResending || isRedirecting}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 py-3.5 text-center text-lg font-medium md:text-2xl hover:bg-gray-50 transition-colors disabled:opacity-60"
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
            disabled={isVerifying || isResending || isRedirecting}
            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-60"
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
