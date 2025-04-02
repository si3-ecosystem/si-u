"use client";

import { Grid, Star, User } from "lucide-react";
import { NotificationButton } from "./notification";
import { ProfileDropdown } from "./ProfileDropdown";
import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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

export function Header() {
  const { open } = useSidebar();
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
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
        <NotificationButton count={1} />
        <ProfileDropdown
          username="annabanana.edu"
          subtext="annabanana.siher.eth"
          avatarUrl="/placeholder.svg?height=80&width=80"
          menuItems={profileMenuItems}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}
