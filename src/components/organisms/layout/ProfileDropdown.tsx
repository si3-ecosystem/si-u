"use client";

import Link from "next/link";
import Image from "next/image";
import type * as React from "react";
import { Grid,  User, ChevronDown, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import LogoutButton from "../auth/LogoutButton";

interface ProfileMenuItem {
  href: string;
  label: string;
  onClick?: () => void;
  icon: React.ReactNode;
  showChevron?: boolean;
}

interface ProfileDropdownProps {
  username: string;
  subtext?: string;
  avatarUrl: string;
  menuItems?: ProfileMenuItem[];
}

export function ProfileDropdown({
  subtext,
  username,
  avatarUrl,
  menuItems = [],
}: ProfileDropdownProps) {
  const defaultMenuItems: ProfileMenuItem[] = [
    {
      label: "Home",
      href: "/home",
      icon: <Grid className="h-5 w-5" />,
      showChevron: true,
    },

    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      showChevron: true,
    },

   
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none bg-[#E8E8E8] rounded-full !p-1 !px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center  justify-center overflow-hidden rounded-full border border-gray-200">
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={username}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>

          <ChevronDown className="size-6" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-0">
        <div className="flex items-center gap-2 !p-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-purple-500">
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt={username}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">{username}</span>

            {subtext && (
              <span className="text-sm text-gray-500">{subtext}</span>
            )}
          </div>
        </div>

        <Separator />

        <div className="!p-1">
          {items.map((item, index) => (
            <DropdownMenuItem
              key={index}
              asChild
              className="flex cursor-pointer justify-between !p-2 text-sm hover:bg-gray-200"
            >
              <Link href={item.href} className="text-black">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.showChevron && <ChevronRight className="h-4 w-4" />}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem className="flex cursor-pointer items-center gap-3 !p-0">
            <LogoutButton />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
