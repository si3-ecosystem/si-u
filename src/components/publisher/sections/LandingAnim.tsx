import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const AnimationHome = () => {
  const landing = useSelector((state: RootState) => state.content?.landing);
  
  // Add null checks to prevent destructuring errors
  const fullName = landing?.fullName || "";
  const headline = landing?.headline || "";

  return (
    <div className="font-sora font-bold text-[2.8rem] sm:text-[3.3rem] lg:text-[3.8rem] leading-[3.2rem] sm:leading-[3.8rem] lg:leading-[4.5rem] tracking-wide">
      <span>I&apos;m </span>
      <span className="text-blue-primary">{fullName.trim().split(" ")[0] ?? ""}</span>
      <span>,</span>
      <span> </span>
      <span>{headline ?? ""}</span>
    </div>
  );
};

export default AnimationHome;
