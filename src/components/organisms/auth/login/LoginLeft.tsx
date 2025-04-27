import React from "react";

import LoginMain from "./LoginMain";
import { RedirectBack } from "./RedirectBack";

const LoginLeft = () => {
  return (
    <div className="hide-scroll container w-full px-4 py-10 sm:p-10 md:overflow-y-scroll">
      <RedirectBack />
      <LoginMain />
    </div>
  );
};

export default LoginLeft;
