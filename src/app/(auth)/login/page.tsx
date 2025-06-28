import LoginLeft from "@/components/organisms/auth/login/LoginLeft";
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="hide-scroll flex h-full min-h-screen w-screen overflow-hidden max-md:justify-end">
    <Image
      src={"/login/Loginpagebg.png"}
      alt="Login Page Background"
      fill
      className="absolute inset-0 -z-10 h-full w-full object-cover"
    />
    <LoginLeft />
  </div>
  );
}
