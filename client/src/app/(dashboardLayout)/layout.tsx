// DashboardLayout.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/service/auth/getUserInfo";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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

          <div className="">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
