import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import React from "react";

interface HeroSectionProps {
  title: string;
  description: string;
  publishedAt?: string;
  image?: any;
}

export function HeroSection({
  title,
  description,
  publishedAt,
  image,
}: HeroSectionProps) {
  return (
    <div className="max-w-[886px] mx-auto w-full ">
      <p className="text-brand text-base font-semibold leading-6 text-center mb-3">
        Published{" "}
        {publishedAt ? new Date(publishedAt).toLocaleDateString() : ""}
      </p>
      <h1 className="title text-[32px] leading-[120%] uppercase text-black text-center mb-4">
        {title}
      </h1>
      <p className="text-xl font-normal leading-[30px] text-center text-brandGray mb-10">
        {description}
      </p>
      <div className="relative h-[476px] w-full mb-10">
        <Image
          src={urlForImage(image)?.src || "/card_placeholder.png"}
          alt="details"
          fill
          className="w-full object-center object-cover h-full"
        />
      </div>
    </div>
  );
}
