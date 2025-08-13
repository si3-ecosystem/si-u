"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Grid,  User, Settings } from "lucide-react";

import { ProfileDropdown } from "./ProfileDropdown";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { getDisplayUsername } from "@/lib/utils/username";

// import {
//   Notification,
//   NotificationPopover,
// } from "@/components/molecules/popovers/NotificationPopover";

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
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    showChevron: true,
  }

 
];

// const notifications: Notification[] = [
//   {
//     id: "1",
//     title: "Community Token Launch",
//     description: "Alpha insights from our Si Her DeFi analysts",
//     time: "16 sec ago",
//     category: "TODAY",
//     read: false,
//   },

//   {
//     id: "2",
//     title: "SI<3> Social Theme",
//     description:
//       "The vote is in! This month's theme is 'Web3 Culture.' Follow and post with the hashtag #web3culture.",
//     time: "16 sec ago",
//     category: "TODAY",
//     read: false,
//   },

//   {
//     id: "3",
//     title: "3 Upcoming Crypto Culture Sessions",
//     description: "Check out the three new Web3 Natives sessions.",
//     time: "16 sec ago",
//     category: "YESTERDAY",
//     read: false,
//   },
// ];

export function Header() {
  const { open } = useSidebar();
  const currentUser = useAppSelector(state => state.user);
  const [isClient, setIsClient] = React.useState(false);

  // Ensure client-side rendering for user data to prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user data with fallbacks - only on client side and when user is initialized
  const isUserReady = isClient && currentUser?.isInitialized;
  const username = isUserReady ? getDisplayUsername(currentUser?.user) : "No username";
  const walletAddress = isUserReady ? currentUser?.user?.walletAddress : null;
  const subtext = isUserReady && walletAddress ?
    `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}.siher.eth` :
    "user.siher.eth";
  const avatarUrl = isUserReady ?
    (currentUser?.user?.avatar || "/placeholder.png") :
    "/placeholder.png";

  // const handleMarkAllRead = () => {
  //   console.log("Marking all as read");
  //   // Update the notifications to set read: true
  // };

  // const handleReadAll = () => {
  //   console.log("Reading all notifications");
  // };

  return (
    <header className="flex sticky z-50 top-0 right-0 left-0 h-16 bg-white items-center justify-between  px-6 md:!pr-20">
      <div className={cn("flex items-center ")}>
        <div className={cn(!open ? " md:block" : "md:hidden", "mt-2")}>
          <SidebarTrigger />
        </div>

        <Link href="/" className={cn(!open ? " md:block" : "md:hidden")}>
          <h2 className="px-4 text-[30px] !text-black font-bold uppercase">
            Si&lt;3&gt;
          </h2>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* <NotificationPopover
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onReadAll={handleReadAll}
        /> */}

        <ProfileDropdown
          username={username}
          avatarUrl={avatarUrl}
          menuItems={profileMenuItems}
          subtext={subtext}
        />
      </div>
    </header>
  );
}
