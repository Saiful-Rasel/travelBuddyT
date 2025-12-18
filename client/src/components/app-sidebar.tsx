"use client";

import React from "react";
import Link from "next/link";
import LogoutButton from "@/components/shared/logoutButon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  user: {
    role: "ADMIN" | "USER" | null;
    fullName?: string;
    email?: string;
  };
}

interface MenuLinksProps {
  menuItems: { label: string; href: string }[];
}

function MenuLinks({ menuItems }: MenuLinksProps) {
  return (
    <SidebarContent className="bg-gray-900 text-white flex-1">
      <SidebarGroup className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            {item.label}
          </Link>
        ))}
      </SidebarGroup>
    </SidebarContent>
  );
}

export function AppSidebar({ user }: AppSidebarProps) {
  const menuItems =
    user.role === "USER"
      ? [
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Travel Plans", href: "/dashboard/travel-plans" },
          { label: "create-travel plan", href: "/dashboard/create-travelplan" },
          { label: "My  Request ", href: "/dashboard/my-request" },
        ]
      : [
          { label: "Overview (Dashboard)", href: "/dashboard/admin" },
          { label: "Manage Users", href: "/dashboard/admin/manage-user" },
          { label: "Manage Travel Plans", href: "/dashboard/admin/manage-travel-plans" },
          { label: "Payment & Subscriptions", href: "/dashboard/admin/payment" },
          // { label: "Payment & Subscriptions", href: "/dashboard/admin/payment-subscriptions" },
        ];

  return (
    <Sidebar className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between">
      <SidebarHeader className="flex items-center justify-between bg-gray-900 px-4 py-4 w-full">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="text-xl font-bold text-blue-300">
            TravelBuddy
          </Link>
          <SidebarTrigger className="text-white ">
            <span>Menu</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
        <hr  className="text-white"/>

      <MenuLinks menuItems={menuItems} />

      <SidebarFooter className="bg-gray-900 p-4">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
