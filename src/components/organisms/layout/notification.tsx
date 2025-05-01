"use client";

import type * as React from "react";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";

interface NotificationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}

export function NotificationButton({
  count = 0,
  className,
  ...props
}: NotificationButtonProps) {
  return (
    <span
      className={cn("relative w-5 h-5 rounded-full bg-white ", className)}
      {...props}
    >
      <Bell className="h-5 w-5 " />
      {count > 0 && (
        <span className="absolute -right-5 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </span>
  );
}
