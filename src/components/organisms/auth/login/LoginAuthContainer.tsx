"use client";

import React from "react";
import Link from "next/link";

import LoginFooter from "./LoginFooter";

import Logo from "@/components/atoms/Logo";

interface LoginAuthContainerProps {
  title: string;
  description: string;
  description2: string;
  children: React.ReactNode;
}

const LoginAuthContainer: React.FC<LoginAuthContainerProps> = ({
  title,
  description,
  description2,
  children,
}) => {
  return (
    <section className="hide-scroll z-50 mx-auto overflow-hidden flex max-w-xl flex-col justify-between space-y-6 bg-white px-4 sm:px-12 py-12 max-sm:rounded-l-[126px] sm:space-y-8 sm:rounded-t-[172px] sm:pt-46 sm:pb-16 md:min-w-[560px]">
      <div className="space-y-6 bg-white md:space-y-8">
        <header className="flex flex-col items-center justify-center gap-5 sm:gap-14">
          <Link href="/" className="" aria-label="Go to homepage">
            <Logo
              src="/login/loginlogo.png"
              className="h-[70px] w-[70px] sm:h-24 sm:w-24"
              alt="SI University Logo"
            />
          </Link>

          <div className="space-y-2.5 text-center">
            <h1 className="self-stretch text-2xl font-medium md:text-[40px]">
              {title}
            </h1>

            <p className="text-xs font-medium text-[#00000082] md:text-sm">
              {description}
            </p>

            <p className="text-sm font-medium md:text-lg">{description2}</p>
          </div>
        </header>

        <main>{children}</main>
      </div>

      <LoginFooter />
    </section>
  );
};

export default LoginAuthContainer;
