"use client";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Heading from "../ui/Heading";

function Value() {
  const data = useSelector((state: RootState) => state.content.value);

  // Safe data extraction with fallbacks
  const experience =
    data?.experience &&
    typeof data.experience === "string" &&
    data.experience.trim() !== ""
      ? data.experience
      : "My professional experience includes twelve years of womxn-in-tech community leadership and fifteen years in growth and partnerships in emerging technology. I am a strong ecosystem builder and connecter, and enjoy creating collaborative value with community networks and product integrations.";

  const values =
    data?.values && typeof data.values === "string" && data.values.trim() !== ""
      ? data.values
      : "My vision is for humanity to reach its greatest potential. This includes equitable and accessible financial systems created with care, emotional intelligence, and compassion.";

  return (
    <div className="p-4 py-10">
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10">
        {/* Values */}
        <section className="flex flex-col items-center sm:items-start w-full space-y-6">
          <Heading label="MY EXPERIENCE SUMMARY" />
          <p className="font-medium text-lg font-sora text-justify">
            {experience}
          </p>
        </section>
        {/* Experience */}
        <section className="flex flex-col items-center sm:items-start w-full space-y-6">
          <Heading label="MY VISION" />
          <div className="font-medium text-lg font-sora text-justify">
            {values}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Value;
