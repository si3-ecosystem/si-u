import React from "react";

import LoginMain from "./LoginMain";

const LoginLeft = () => {
  return (
    <div className="no-scrollbar min-h-screen overflow-y-scroll pt-[65px] pl-6 max-sm:pb-[65px] sm:pt-18 md:pl-[120px]">
      {/* <RedirectBack /> */}
      <LoginMain />
    </div>
  );
};

export default LoginLeft;
