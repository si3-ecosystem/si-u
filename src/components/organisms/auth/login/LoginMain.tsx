// "use client";

// import React, { useState } from "react";

// import LoginOTP from "./LoginOTP";
// import LoginMail from "./LoginMail";
// import EtherMail from "./EtherMail";
// import InjectedWallet from "./InjectedWallet";

// import LoginAuthContainer from "./LoginAuthContainer";

// const AuthContainer = () => {
//   const [userEmail, setUserEmail] = useState<string>("");
//   const [authState, setAuthState] = useState<"initial" | "otp">("initial");

//   const handleEmailSubmit = async (email: string): Promise<void> => {
//     try {
//       console.log("Email submitted:", email);

//       // Store email and transition to OTP screen
//       // The actual API call is handled in LoginMail component
//       setUserEmail(email);
//       setAuthState("otp");
//     } catch (error) {
//       console.error("Failed to process email submission:", error);
//       throw error;
//     }
//   };

//   const handleOTPVerify = async (otpCode: string): Promise<void> => {
//     try {
//       console.log("OTP verified:", otpCode);
//       // The actual API call is handled in LoginOTP component
//     } catch (error) {
//       console.error("OTP verification failed:", error);
//       throw error;
//     }
//   };

//   const handleAuthSuccess = (data: any) => {
//     console.log("Authentication successful:", data);

//     // Store only token in localStorage
//     if (data.token) {
//       localStorage.setItem("si3-token", data.token);
//     }
//   };

//   const handleBackToInitial = () => {
//     setAuthState("initial");
//     setUserEmail("");
//   };

//   // OTP Screen - Clean minimal layout
//   if (authState === "otp") {
//     return (
//       <LoginAuthContainer
//         title="Verify Your Email"
//         description="Complete your journey to SI University"
//         description2="We've sent a verification code to your email"
//       >
//         <div className="max-w-md mx-auto w-full">
//           <LoginOTP
//             email={userEmail}
//             onBack={handleBackToInitial}
//             onVerify={handleOTPVerify}
//             onSuccess={handleAuthSuccess}
//           />
//         </div>
//       </LoginAuthContainer>
//     );
//   }

//   return (
//     <LoginAuthContainer
//       title="Welcome to SI University"
//       description="Onboarding emerging tech organizations, explorers and guides"
//       description2="It's so nice to SI you"
//     >
//       <div className="space-y-3 md:space-y-4">
//         <InjectedWallet />
//         <EtherMail />
//       </div>

//       <div className="my-5 flex items-center md:my-5">
//         <hr className="flex-grow border-gray-300" />

//         <span className="md:text-md px-2 text-xs text-gray-500 md:px-3">
//           OR
//         </span>

//         <hr className="flex-grow border-gray-300" />
//       </div>

//       <LoginMail onSubmit={handleEmailSubmit} />
//     </LoginAuthContainer>
//   );
// };

// export default AuthContainer;

"use client";

import React, { useState } from "react";

import LoginOTP from "./LoginOTP";
import LoginMail from "./LoginMail";
import EtherMail from "./EtherMail";
import InjectedWallet from "./InjectedWallet";

import LoginAuthContainer from "./LoginAuthContainer";

const AuthContainer = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [authState, setAuthState] = useState<"initial" | "otp">("initial");

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setAuthState("otp");
  };

  const handleAuthSuccess = (data: any) => {
    if (data.token) {
      localStorage.setItem("si3-token", data.token);
    }
  };

  const handleBackToInitial = () => {
    setAuthState("initial");
    setUserEmail("");
  };

  if (authState === "otp") {
    return (
      <LoginAuthContainer
        title="Verify Your Email"
        description="Complete your journey to SI University"
        description2="We've sent a verification code to your email"
      >
        <div className="max-w-md mx-auto w-full">
          <LoginOTP
            email={userEmail}
            onBack={handleBackToInitial}
            onSuccess={handleAuthSuccess}
          />
        </div>
      </LoginAuthContainer>
    );
  }

  return (
    <LoginAuthContainer
      title="Welcome to SI University"
      description="Onboarding emerging tech organizations, explorers and guides"
      description2="It's so nice to SI you"
    >
      <div className="space-y-3 md:space-y-4">
        <InjectedWallet />
        <EtherMail />
      </div>

      <div className="my-5 flex items-center md:my-5">
        <hr className="flex-grow border-gray-300" />
        <span className="md:text-md px-2 text-xs text-gray-500 md:px-3">
          OR
        </span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <LoginMail onSubmit={handleEmailSubmit} />
    </LoginAuthContainer>
  );
};

export default AuthContainer;
