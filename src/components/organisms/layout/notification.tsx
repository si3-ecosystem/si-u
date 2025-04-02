"use client";

import type * as React from "react";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative rounded-full bg-white border", className)}
      {...props}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  );
}
