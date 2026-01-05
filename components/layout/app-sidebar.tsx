import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/config/i18n/navigation";
import { siteName } from "@/config/site";
import { getSidebarUserData } from "@/app/actions/auth";

import { getSidebarGroupsContent } from "./app-sidebar.data";
import AppSidebarUser from "./app-sidebar-user";

export default async function AppSidebar() {
  const nav = await getSidebarGroupsContent();
  const user = await getSidebarUserData();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center gap-2 overflow-hidden">
        <Image
          alt="Novaluxe Dynamics"
          height={36}
          src={"/favicon.png"}
          width={36}
        />
        <span className="text-nowrap text-ellipsis">{siteName}</span>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>{user && <AppSidebarUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
