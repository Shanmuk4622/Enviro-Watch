"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { Logo } from "@/components/icons";
import { Home, Map, Settings, TabletSmartphone, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/map", label: "Live Map", icon: Map },
  { href: "/devices", label: "Devices", icon: TabletSmartphone },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider defaultOpen open={open} onOpenChange={setOpen}>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="group-data-[collapsible=icon]:border-r"
      >
        <SidebarHeader className="h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-7 text-primary" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              EnviroWatch
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: 'Log Out' }}>
                  <LogOut />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-8 pt-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
