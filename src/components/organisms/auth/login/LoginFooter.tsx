import React from "react";
import Link from "next/link";
import Image from "next/image";

const LoginFooter = () => {
  return (
    <div className="flex flex-col justify-between gap-8 bg-white">
      <p className="mx-auto mt-2 max-w-[288px] text-center text-base text-gray-500">
        By continuing, you agree to {"SI<3>'s"}
        <Link
          href="/policy/membersPolicy"
          className="font-medium underline hover:text-purple-500"
        >
          {" "}
          Member Policy
        </Link>{" "}
        and{" "}
        <Link
          href="/policy/privacy"
          className="font-medium underline hover:text-purple-500"
        >
          {" "}
          Privacy Policy
        </Link>
      </p>

      <div className="flex h-full w-full items-center justify-end">
        <Image
          src={"/login/smalllogo.png"}
          width={40}
          height={40}
          alt="logo"
          className="h-auto w-[36px]"
        />
      </div>
    </div>
  );
};

export default LoginFooter;
