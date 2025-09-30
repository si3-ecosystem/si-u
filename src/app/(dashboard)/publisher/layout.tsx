import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center">
      {children}
    </div>
  );
};

export default layout;
