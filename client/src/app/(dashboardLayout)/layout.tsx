// DashboardLayout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/service/auth/getUserInfo";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TravelBuddy",
  description: "This is a traveler Website",
};


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar user={user} />

        <main className="flex-1 relative overflow-auto">
          <div className="absolute top-6 left-4  z-50">
            <SidebarTrigger/>
          </div>

          <div className="">
            <Toaster richColors position="top-right" />
            {children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
