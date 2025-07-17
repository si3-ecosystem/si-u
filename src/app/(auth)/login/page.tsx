import React from "react";
import Image from "next/image";

import LoginLeft from "@/components/organisms/auth/login/LoginLeft";

export const metadata = {
  title: "SI U | Login",
  description: "Login to your account",
};

const LoginPage = () => {
  return (
    <div className="hide-scroll flex h-full min-h-screen w-screen overflow-hidden max-md:justify-end relative">
      <Image
        fill
        alt="Login Page Background"
        src="/login/Loginpagebg.png"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      <LoginLeft />
    </div>
  );
};

export default LoginPage;
