"use client";

import React from "react";
import Link from "next/link";

import LoginMail from "./LoginMail";
import EtherMail from "./EtherMail";
// import LoginButton from "./LoginButton";
import LoginFooter from "./LoginFooter";

import Logo from "@/components/atoms/Logo";
// import OpenCampusID from "./OpenCampusID";
import InjectedWallet from "./InjectedWallet";

const LoginMain = () => {
  return (
    <section className="hide-scroll z-50 mx-auto flex max-w-[561px] flex-col justify-between space-y-6 bg-white px-[46px] pt-[43px] pb-[27px] max-sm:rounded-l-[126px] sm:space-y-8 sm:rounded-t-[172px] sm:pt-14 sm:pb-16">
      <div className="space-y-6 bg-white md:space-y-8">
        <div className="flex flex-col items-center justify-center gap-5 sm:gap-14">
          <Link href="/" className="">
            <Logo
              src="/login/loginlogo.png"
              className="h-[70px] w-[70px] sm:h-24 sm:w-24"
            />
          </Link>

          <div className="space-y-2.5">
            <h1 className="self-stretch text-center text-2xl font-medium md:text-[40px]">
              Welcome to SI University
            </h1>

            <p className="text-center text-xs font-medium text-[#00000082] md:text-sm">
              Onboarding emerging tech organizations, explorers and guides.
            </p>
            <p className="text-center text-sm font-medium md:text-lg">
              It&apos;s so nice to SI you.
            </p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <InjectedWallet />
          <EtherMail />

          {/* <OpenCampusID /> */}
        </div>

        <div className="my-5 flex items-center md:my-5">
          <hr className="flex-grow border-gray-300" />

          <span className="md:text-md px-2 text-xs text-gray-500 md:px-3">
            OR
          </span>

          <hr className="flex-grow border-gray-300" />
        </div>

        <LoginMail />
      </div>
      <LoginFooter />
    </section>
  );
};

export default LoginMain;
