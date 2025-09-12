"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Heading from "../ui/Heading";

const Orgs = () => {
  const data = useSelector((state: RootState) => state.content.organizations);

  // Safe data handling with fallback
  const organizations =
    Array.isArray(data) && data.length > 0
      ? data
      : [
          "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/unlock_nrtdlk.png",
          "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/dune_n4xvii.png",
          "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363967/zerion_sjjw6q.png",
          "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/stellar_luopdr.png",
          "https://res.cloudinary.com/dv52zu7pu/image/upload/v1752363966/ledger_umjp3a.png",
        ];

  if (!organizations.length) return null;

  return (
    <div className="px-4 py-10 bg-gray-100">
      <div className="max-w-[90rem] mx-auto flex flex-col gap-8 justify-center items-center">
        <Heading label="ORGANIZATIONS I SUPPORT" />
        <section className="w-full flex flex-col md:flex-row gap-10 justify-center items-center">
          {organizations.map((org) => (
            <Image key={org} src={org} alt="" width={100} height={100} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Orgs;
