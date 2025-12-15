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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <div className="flex flex-col min-h-screen">
          <NavbarServer />
          <main className="flex-1 pt-[76px] pb-[120px]">{children}</main>
          <Toaster position="top-right" />
          <Footer />
        </div>
      </body>
    </html>
  );
}
