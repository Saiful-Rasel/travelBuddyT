import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/shared/footer";
import NavbarServer from "@/components/shared/navbarServer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelBuddy",
  description: "This is a traveler Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          bg-gray-50 text-gray-900 
          dark:bg-gray-900 dark:text-gray-50`} // 
      >
        <div className="flex flex-col min-h-screen">
          <NavbarServer />
          <main className="flex-1 pt-[76px] ">
            {children}
          </main>
          <Toaster richColors position="top-right" />
          <div className="mt-4">
            <Footer  />
          </div>
        </div>
      </body>
    </html>
  );
}
