"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface KollaboardCardProps {
  title: string;
  organization: string;
  buttonText: string;
  buttonVariant?: "primary" | "outline";
  imageSrc?: string;
  className?: string;
}

export function KollaboardCard({
  title,
  organization,
  buttonText,
  buttonVariant = "outline",
  imageSrc,
  className = "",
}: KollaboardCardProps) {
  return (
    <div className={`flex items-center justify-between border rounded-lg p-4 bg-white ${className}`}>
      <div className="flex items-center gap-4">
        <Image
          src={imageSrc || "/frame11.png"}
          alt={title}
          width={48}
          height={48}
          className="object-cover rounded"
        />
        <div>
          <h3 className="font-bold font-roobert">{title}</h3>
          <p className="text-sm text-gray-500 font-roobert">
            {organization}
          </p>
        </div>
      </div>
      <Button
        variant={buttonVariant === "primary" ? "default" : "outline"}
        className={`rounded-full ${
          buttonVariant === "primary"
            ? "bg-black text-white hover:bg-gray-800"
            : ""
        }`}
      >
        {buttonText}
      </Button>
    </div>
  );
}
