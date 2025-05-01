"use client";

import { NotificationButton } from "@/components/organisms/layout/notification";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useState } from "react";

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  read: boolean;
}

export interface NotificationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}

export interface NotificationPopoverProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onReadAll?: () => void;
}

export function NotificationPopover({
  notifications,
  onMarkAllRead,
  onReadAll,
}: NotificationPopoverProps) {
  const [open, setOpen] = useState(false);

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const category = notification.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="text-black">
        <NotificationButton count={unreadCount} />
      </PopoverTrigger>
      <PopoverContent
        className="w-64 sm:w-96 p-0 z-30 overflow-hidden rounded-lg border shadow-md"
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between py-3.5 px-6 border-b">
          <h3 className=" font-medium text-black">Notifications</h3>
          {unreadCount > 0 && (
            <div
              className="text-brand text-sm font-medium"
              onClick={() => {
                onMarkAllRead?.();
                setOpen(false);
              }}
            >
              Mark all as read
            </div>
          )}
        </div>
        <div className="max-h-[330px] overflow-y-auto py-4 flex flex-col gap-6 ">
          {Object.entries(groupedNotifications).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-2">
              <div className=" text-sm font-medium text-brandGray  px-6">
                {category}
              </div>
              <div className="flex flex-col gap-4">
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 px-6 py-2"
                      //   !notification.read && "bg-brand/25"
                    )}
                  >
                    <div className="h-8 w-8 rounded-full p-1 bg-[#E7E7E7] flex items-center justify-center">
                      <Bell className="h-5 w-5 text-brandGray " />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex justify-between w-full gap-4">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#888] font-normal">
                          {notification.time}
                        </p>
                      </div>
                      <p className="text-sm text-brandGray leading-5">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#E7E7E7] w-full py-2.5">
          <button
            className="w-full text-sm font-medium text-black"
            onClick={() => {
              onReadAll?.();
              setOpen(false);
            }}
          >
            Read all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
