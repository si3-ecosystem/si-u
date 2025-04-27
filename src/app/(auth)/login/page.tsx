import LoginMain from "@/components/organisms/auth/login/LoginMain";
import { RedirectBack } from "@/components/organisms/auth/login/RedirectBack";
import React from "react";

export default function page() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f6f6f6]">
      <div className="hide-scroll container w-full px-4 py-10 sm:p-10 ">
        <RedirectBack />
        <LoginMain />
      </div>
    </div>
  );
}
