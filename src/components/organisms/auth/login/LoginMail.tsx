import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React from "react";

const LoginMail = () => {
  return (
    <div className="space-y-3.5">
      <label className="md:text-md sr-only block text-sm font-medium">
        Email
      </label>

      <div className="relative mt-2 border">
        <input
          type="email"
          className="md:text-md w-full rounded-lg p-2 text-lg md:p-3 md:text-sm"
          placeholder="youremail@mail.com"
        />
      </div>
      <button
        className={cn(
          "flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E7E7E7] py-3.5 text-center text-lg font-medium md:text-2xl",
        )}
      >
        Continue <ArrowRight className="w-4" />
      </button>
      <p className="text-center text-xs font-medium text-[#00000082]">
        Welcome onboard as we set sail towards a brighter new economy and
        future.
      </p>
    </div>
  );
};

export default LoginMail;
