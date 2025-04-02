"use client";

import { Grid, Star, User } from "lucide-react";
import { NotificationButton } from "./notification";
import { ProfileDropdown } from "./ProfileDropdown";
import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Notification,
  NotificationPopover,
} from "@/components/molecules/popovers/NotificationPopover";

const profileMenuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Grid className="h-5 w-5" />,
    showChevron: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <User className="h-5 w-5" />,
    showChevron: true,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: <Star className="h-5 w-5" />,
    showChevron: true,
  },
];

const notifications: Notification[] = [
  {
    id: "1",
    title: "Community Token Launch",
    description: "Alpha insights from our Si Her DeFi analysts",
    time: "16 sec ago",
    category: "TODAY",
    read: false,
  },
  {
    id: "2",
    title: "SI<3> Social Theme",
    description:
      "The vote is in! This month's theme is 'Web3 Culture.' Follow and post with the hashtag #web3culture.",
    time: "16 sec ago",
    category: "TODAY",
    read: false,
  },
  {
    id: "3",
    title: "3 Upcoming Crypto Culture Sessions",
    description: "Check out the three new Web3 Natives sessions.",
    time: "16 sec ago",
    category: "YESTERDAY",
    read: false,
  },
];

export function Header() {
  const { open } = useSidebar();
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
  };

  const handleMarkAllRead = () => {
    console.log("Marking all as read");
    // Update the notifications to set read: true
  };

  const handleReadAll = () => {
    console.log("Reading all notifications");
    // Navigate to a notifications page or clear notifications
  };
  return (
    <header className="flex sticky z-50 top-0 right-0 left-0 h-16 bg-white items-center justify-between  px-6 md:!pr-20">
      <div className={cn("flex items-center ")}>
        <div className={cn(!open ? " md:block" : "md:hidden", "mt-2")}>
          <SidebarTrigger />
        </div>
        <Link href="/" className={cn(!open ? " md:block" : "md:hidden")}>
          <h2 className=" px-4 text-[30px] !text-black font-bold uppercase">
            {"Si<3>"}
          </h2>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <NotificationPopover
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onReadAll={handleReadAll}
        />
        <ProfileDropdown
          username="annabanana.edu"
          subtext="annabanana.siher.eth"
          avatarUrl="/placeholder.png"
          menuItems={profileMenuItems}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}
