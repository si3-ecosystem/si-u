import React from "react";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Image from "next/image";

import AuthContainerV2 from "@/components/authv2/AuthContainerV2";

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

      <div className="h-screen absolute justify-center sm:-translate-y-0 sm:bottom-0 sm:left-6 lg:left-32 flex flex-col sm:justify-end">
        <AuthContainerV2 />
      </div>
    </div>
  );
};

export default LoginPage;
