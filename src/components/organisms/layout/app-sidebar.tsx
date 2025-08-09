"use client";

import {
  Users,
  Video,
  Brain,
  Share2,
  Settings,
  ScrollText,
  Shield,
  Presentation,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  useSidebar,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import LogoutButton from "../auth/LogoutButton";

// Define types for menu items
interface MenuItem {
  href: string;
  title: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SubMenuGroup {
  title: string;
  items: MenuItem[];
}

const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Communities",
    icon: Users,
    href: "/communities",
  },
  {
    title: "Admin Dashboard",
    icon: Shield,
    href: "/admin/dashboard",
  },
  // {
  //   title: "Guides",
  //   icon: BookOpen,
  //   href: "/guides",
  // },
  // {
  //   title: "Diversity Tracker",
  //   icon: Users2,
  //   href: "/diversity-tracker",
  // },
];

const subMenuGroups: SubMenuGroup[] = [
  {
    title: "SI HER GUIDES",
    items: [
      { title: "Sessions", icon: Video, href: "/guides/sessions" },
      { title: "Ideas Lab", icon: Brain, href: "/guides/ideas-lab" },
      { title: "Go Live (Coming Soon) ", icon: Share2, href: "/#" },
      { title: "Publisher", icon: Globe, href: "/publisher" },
    ],
  },
  {
    title: "SI U SCHOLARS",
    items: [
      { title: "Sessions", icon: Video, href: "/scholars/sessions" },
      // {
      //   title: "Web3 Natives",
      //   icon: UserSquare2,
      //   href: "/web3-natives",
      // },
      { title: "Ideas Lab", icon: Brain, href: "/scholars/ideas-lab" },
    ],
  },
  {
    title: "GROW3EDGE ACCELERATOR",
    items: [
      {
        title: "Grow3dge Sessions",
        icon: Presentation,
        href: "/grow3dge/grow3dge-sessions",
      },
      {
        title: "Grow3dge Playbook",
        icon: ScrollText,
        href: "/grow3dge/grow3dge-playbook",
      },
    ],
  },
  // {
  //   title: "DEAI WEB3 PARTICIPANTS",
  //   items: [
  //     { title: "DEAI Web3 Sessions", icon: Video, href: "/deai-web3-sessions" },
  //   ],
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  if (!open) return null;

  const allMenuItems: MenuItem[] = [
    ...mainMenuItems,
    ...subMenuGroups.flatMap((group) => group.items),
  ];

  const longestMatchingHref = allMenuItems
    .filter((item) => {
      if (item.href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(item.href);
    })
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const isActive = (href: string) => {
    return href === longestMatchingHref;
  };

  return (
    <div>
      <Sidebar className={cn("border-r !bg-white border", !open && "!w-0")}>
        <SidebarHeader className="!py-8 !px-6 bg-white">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="">
              <h2 className="px-4 text-[30px] !text-black font-bold uppercase">
                {"Si<3>"}
              </h2>
            </Link>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className={cn("!px-6 !bg-white", !open && "w-0")}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              {mainMenuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full !px-2.5 justify-start h-11 text-sm cursor-pointer",
                      isActive(item.href) && "bg-purple-50 text-purple-600"
                    )}
                  >
                    <item.icon className="mr-2 h-6 w-6" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>

            {subMenuGroups.map((group) => (
              <div key={group.title} className="">
                <h3 className="font-medium text-xs text-[#6D6D6D] pr-4 !mb-2">
                  {group.title}
                </h3>
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full !px-2.5 !py-1.5 justify-start h-11 text-black cursor-pointer",
                        isActive(item.href) && "bg-purple-50 text-purple-600"
                      )}
                    >
                      <item.icon className="mr-2 h-6 w-6" />
                      <span className="flex-1 text-left text-sm">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-xs text-gray-400">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter className="mt-auto px-6 !pb-5 !pt-4 gap-0 space-y-0 bg-white">
          <Link href="/settings">
            <Button
              variant="ghost"
              className="w-full justify-start h-11 !px-2.5"
            >
              <Settings className="mr-2 h-6 w-6" />
              Settings
            </Button>
          </Link>

          <LogoutButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
