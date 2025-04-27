import { ArrowRight } from "lucide-react";
import React from "react";

const LoginMail = () => {
  return (
    <div>
      <label className="md:text-md block text-sm font-medium">Email</label>

      <div className="relative mt-2 border">
        <input
          type="email"
          className="md:text-md w-full rounded-lg p-2 text-sm md:p-3"
          placeholder="youremail@mail.com"
        />

        <button className="md:text-md absolute inset-y-0 top-1/2 right-2 h-fit -translate-y-1/2 cursor-pointer rounded-sm bg-purple-500 p-2 text-white hover:bg-purple-600">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default LoginMail;
