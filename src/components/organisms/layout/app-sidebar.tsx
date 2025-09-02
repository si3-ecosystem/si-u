"use client";

import {
  Users,
  Video,
  Brain,
  Share2,
  Settings,
  Shield,
  Presentation,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useCurrentUserV2 } from "@/hooks/auth/useCurrentUserV2";

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
import Image from "next/image";

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
    title: "Home",
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
      { title: "Si Her Publisher", icon: Globe, href: "/publisher" },
      { title: "Go Live (Coming Soon) ", icon: Share2, href: "#" },
    ],
  },
  {
    title: "SI U SCHOLARS",
    items: [
      { title: "Sessions", icon: Video, href: "/scholars/sessions" },
      { title: "Ideas Lab", icon: Brain, href: "/scholars/ideas-lab" },
    ],
  },
  {
    title: "GROW3DGE PROGRAM",
    items: [
      {
        title: "Sessions",
        icon: Presentation,
        href: "/grow3dge/grow3dge-sessions",
      },
      {
        title: "Ideas Lab",
        icon: Brain,
        href: "/grow3dge/ideas-lab",
      },
      // {
      //   title: "Grow3dge Playbook",
      //   icon: ScrollText,
      //   href: "/grow3dge/grow3dge-playbook",
      // },
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
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { user, isAuthenticated } = useCurrentUserV2();

  // Get user roles for filtering menu items
  const userRoles = (isAuthenticated && user?.roles) ? user.roles : [];
  const userEmail = (isAuthenticated && user?.email) ? user.email : "";
  const isAdmin = userRoles.includes("admin");
  const isGuide = userRoles.includes("guide");
  const isPartner = userRoles.includes("partner");
  
  // List of allowed scholar emails
  const allowedScholarEmails = [
    "shoagasraful4231@gmail.com",
    "asraful.islam@tutors.es",
    "brenda.c.altamirano@gmail.com",
    "Donna@boostalyze.com",
    "estherjoy947@gmail.com",
    "imhaseeb8@gmail.com",
    "jaris.careers@gmail.com",
    "318solaris@gmail.com",
    "immanuelkristie@gmail.com",
    "kara@si3.space",
    "masha.vaverova@gmail.com",
    "raheelahmed5650@gmail.com",
    "muhammadsalmansarwar32@gmail.com",
    "Zainalis.914@gmail.com"
  ];
  
  // Check if user is an allowed scholar
  const isAllowedScholar = allowedScholarEmails.includes(userEmail.toLowerCase());

  // Filter menu items based on roles
  const filteredMainMenuItems = useMemo(() => {
    if (isAdmin) {
      // Admin sees all main menu items
      return mainMenuItems;
    }
    
    // For non-admin users, filter out admin dashboard
    return mainMenuItems.filter(item => item.href !== "/admin/dashboard");
  }, [isAdmin]);

  const filteredSubMenuGroups = useMemo(() => {
    if (isAdmin) {
      // Admin sees all submenu groups
      return subMenuGroups;
    }

    return subMenuGroups.filter(group => {
      if (group.title === "SI HER GUIDES" && (isGuide || isAdmin)) {
        return true;
      }
      if (group.title === "SI U SCHOLARS" && (isAllowedScholar || isAdmin)) {
        return true;
      }
      if (group.title === "GROW3DGE PROGRAM" && (isPartner || isAdmin)) {
        return true;
      }
      return false;
    });
  }, [isAdmin, isGuide, isPartner, isAllowedScholar]);

  if (!open) return null;

  // Function to handle menu item clicks and close sidebar on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const allMenuItems: MenuItem[] = [
    ...filteredMainMenuItems,
    ...filteredSubMenuGroups.flatMap((group) => group.items),
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
            <Link
              href="/"
              className={cn(!open ? " " : "")}
              onClick={handleLinkClick}
            >
              <div className="px-4">
                <Image
                  src={"/logo.svg"}
                  alt={"Logo"}
                  width={120}
                  height={40}
                  className="!h-6 sm:!h-8 w-auto object-contain"
                />
              </div>
            </Link>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className={cn("!px-6 !bg-white", !open && "w-0")}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              {filteredMainMenuItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleLinkClick}>
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

            {filteredSubMenuGroups.map((group) => (
              <div key={group.title} className="">
                <h3 className="font-medium text-xs text-[#6D6D6D] pr-4 !mb-2">
                  {group.title}
                </h3>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                  >
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
          <Link href="/settings" onClick={handleLinkClick}>
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
