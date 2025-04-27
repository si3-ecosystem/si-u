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
    <section className="mx-auto max-w-[528px] bg-white p-8 pb-10">
      <div className="flex flex-col items-center justify-center gap-8">
        <Link href="/" className="">
          <Logo src="/logo.svg" />
        </Link>

        <div className="mt-8">
          <h1 className="text-center text-4xl font-bold">
            Login into your account
          </h1>

          <p className="mt-2 text-center text-lg font-medium">
            It&apos;s so nice to SI you 👋
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 md:mt-6 md:space-y-4">
        <InjectedWallet />
        <EtherMail />

        {/* <OpenCampusID /> */}
      </div>

      <div className="my-6 flex items-center md:my-8">
        <hr className="flex-grow border-gray-300" />

        <span className="md:text-md px-2 text-xs text-gray-500 md:px-3">
          OR
        </span>

        <hr className="flex-grow border-gray-300" />
      </div>

      <LoginMail />
      <LoginFooter />
    </section>
  );
};

export default LoginMain;
