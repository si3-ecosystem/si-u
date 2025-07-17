import React from "react";

import LoginMain from "./LoginMain";

const LoginLeft = () => {
  return (
    <div className="h-screen absolute justify-center sm:-translate-y-0 sm:bottom-5 sm:left-6 lg:left-32 flex flex-col sm:justify-end">
      <LoginMain />
    </div>
  );
};

export default LoginLeft;
