import type React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  iconColor?: string;
}

export function StatsCard({
  icon,
  title,
  value,
  iconColor = "bg-yellow-100",
}: StatsCardProps) {
  return (
    <div className="flex flex-1 items-start gap-3 rounded-lg bg-white p-3 py-[22px] ">
      <div className="flex flex-col">
        <div className="flex flex-col lg:flex-row  items-start gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${iconColor}`}
          >
            {icon}
          </div>
          <p className="text-sm text-brandGray font-medium leading-4">
            {title}
          </p>
        </div>
        <p className="text-2xl font-semibold lg:ml-8">{value}</p>
      </div>
    </div>
  );
}

export function StatsCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 grid gap-4 grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {children}
    </div>
  );
}
