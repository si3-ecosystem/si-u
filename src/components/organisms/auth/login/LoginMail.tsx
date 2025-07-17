// "use client";

// import React, { useState } from "react";
// import { cn } from "@/lib/utils";
// import { ArrowRight } from "lucide-react";

// interface LoginMailProps {
//   onSubmit: (email: string) => Promise<void>;
// }

// const LoginMail: React.FC<LoginMailProps> = ({ onSubmit }) => {
//   const [email, setEmail] = useState<string>("");

//   const [error, setError] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const validateEmail = (email: string): boolean => {
//     return !!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!email.trim()) {
//       setError("Please enter your email address");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       await onSubmit(email);
//     } catch (error) {
//       setError("Failed to send verification code. Please try again.");
//       console.error("Email submission failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3.5">
//       <label className="md:text-md sr-only block text-sm font-medium">
//         Email
//       </label>

//       <div className="relative mt-2 border">
//         <input
//           type="email"
//           value={email}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//             setEmail(e.target.value);
//             setError(""); // Clear error when user types
//           }}
//           placeholder="youremail@mail.com"
//           className={cn(
//             "md:text-md w-full rounded-lg p-2 text-lg md:p-3 md:text-sm",
//             error ? "border-red-300 focus:border-red-500" : "border-gray-300"
//           )}
//           disabled={isLoading}
//         />
//       </div>

//       {error && (
//         <p className="text-red-500 text-xs md:text-sm font-medium">{error}</p>
//       )}

//       <button
//         type="submit"
//         disabled={isLoading || !email.trim()}
//         className={cn(
//           "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
//           isLoading || !email.trim()
//             ? "bg-gray-200 cursor-not-allowed opacity-60"
//             : "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
//         )}
//       >
//         {isLoading ? (
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
//             Sending...
//           </div>
//         ) : (
//           <>
//             Continue <ArrowRight className="w-4" />
//           </>
//         )}
//       </button>

//       <p className="text-center text-xs font-medium text-[#00000082]">
//         Welcome onboard as we set sail towards a brighter new economy and
//         future.
//       </p>
//     </form>
//   );
// };

// export default LoginMail;

// "use client";

// import React, { useState } from "react";
// import { ArrowRight } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { authService } from "@/lib/api/authService";

// interface LoginMailProps {
//   onSubmit: (email: string) => Promise<void>;
// }

// const LoginMail: React.FC<LoginMailProps> = ({ onSubmit }) => {
//   const [email, setEmail] = useState<string>("");

//   const [error, setError] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const validateEmail = (email: string): boolean => {
//     return !!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!email.trim()) {
//       setError("Please enter your email address");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await authService.sendEmailOTP(email);

//       console.log("OTP sent successfully:", response.message);

//       await onSubmit(email);
//     } catch (error: any) {
//       const errorMessage =
//         error.message || "Failed to send verification code. Please try again.";

//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3.5">
//       <label className="md:text-md sr-only block text-sm font-medium">
//         Email
//       </label>

//       <div className="relative mt-2 border">
//         <input
//           type="email"
//           value={email}
//           disabled={isLoading}
//           placeholder="youremail@si3.space"
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//             setEmail(e.target.value);
//             setError("");
//           }}
//           className={cn(
//             "md:text-md w-full rounded-lg p-2 text-lg md:p-3 md:text-sm",
//             error ? "border-red-300 focus:border-red-500" : "border-gray-300"
//           )}
//         />
//       </div>

//       {error && (
//         <p className="text-red-500 text-xs md:text-sm font-medium">{error}</p>
//       )}

//       <button
//         type="submit"
//         disabled={isLoading || !email.trim()}
//         className={cn(
//           "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
//           isLoading || !email.trim()
//             ? "bg-gray-200 cursor-not-allowed opacity-60"
//             : "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
//         )}
//       >
//         {isLoading ? (
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
//             Sending...
//           </div>
//         ) : (
//           <>
//             Continue <ArrowRight className="w-4" />
//           </>
//         )}
//       </button>

//       <p className="text-center text-xs font-medium text-[#00000082]">
//         Welcome onboard as we set sail towards a brighter new economy and
//         future.
//       </p>
//     </form>
//   );
// };

// export default LoginMail;

"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { authService } from "@/lib/api/authService";

interface LoginMailProps {
  onSubmit: (email: string) => void;
}

const LoginMail: React.FC<LoginMailProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    return !!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.sendEmailOTP(email);
      onSubmit(email);
    } catch (error: any) {
      setError(
        error.message || "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <label className="md:text-md sr-only block text-sm font-medium">
        Email
      </label>

      <div className="relative mt-2 border">
        <input
          type="email"
          value={email}
          disabled={isLoading}
          placeholder="youremail@si3.space"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setError("");
          }}
          className={cn(
            "md:text-md w-full rounded-lg p-2 text-lg md:p-3 md:text-sm",
            error ? "border-red-300 focus:border-red-500" : "border-gray-300"
          )}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs md:text-sm font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || !email.trim()}
        className={cn(
          "flex w-full items-center justify-center gap-1.5 rounded-lg py-3.5 text-center text-lg font-medium md:text-2xl transition-colors",
          isLoading || !email.trim()
            ? "bg-gray-200 cursor-not-allowed opacity-60"
            : "bg-[#E7E7E7] hover:bg-[#D7D7D7] cursor-pointer"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          <>
            Continue <ArrowRight className="w-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs font-medium text-[#00000082]">
        Welcome onboard as we set sail towards a brighter new economy and
        future.
      </p>
    </form>
  );
};

export default LoginMail;
