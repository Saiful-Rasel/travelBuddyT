/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMenu, HiX, HiSun, HiMoon } from "react-icons/hi";
import { User } from "../types/user";
import LogoutButton from "./logoutButon";

interface NavbarClientProps {
  currentUser: User | null;
}

export default function NavbarClient({ currentUser }: NavbarClientProps) {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const defaultImage = "/images/download.png";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const links = [
    { href: "/travel-plans", label: "All Travel Plans", public: true },
    { href: "/explore", label: "Explore Travelers", public: true },
    { href: "/find-buddy", label: "Find Travel Buddy", guestOnly: true },
    { href: "/login", label: "Login", guestOnly: true },
    { href: "/register", label: "Register", guestOnly: true, fontBold: true },
    { href: "/dashboard/travel-plans", label: "My Travel Plans", role: "USER" },
    { href: "/dashboard", label: "User Dashboard", role: "USER" },
    { href: "/dashboard/admin", label: "Admin Dashboard", role: "ADMIN" },
  ];

  return (
    <nav className="w-full px-4 md:px-10 py-4 fixed top-0 z-50 flex justify-between items-center shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
        TravelBuddy
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {links.map((link, idx) => {
          if (link.role && link.role !== currentUser?.role) return null;
          if (link.guestOnly && currentUser) return null;
          return (
            <Link
              key={idx}
              href={link.href}
              className={`${link.fontBold ? "font-semibold" : ""} hover:text-blue-600 dark:hover:text-blue-400`}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Dark mode toggle always visible */}
        <button onClick={toggleDarkMode}>
          {darkMode ? <HiSun size={22} /> : <HiMoon size={22} />}
        </button>

        {/* Profile & Logout */}
        {currentUser && (
          <>
            <Link
              href={`/profile/${currentUser.id}`}
              className="relative flex items-center"
              title={currentUser.fullName}
            >
              <Image
                src={currentUser.profileImage || defaultImage}
                alt="User Image"
                width={40}
                height={40}
                className="rounded-full border cursor-pointer"
              />
            </Link>
            <LogoutButton />
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <button onClick={toggleDarkMode}>
          {darkMode ? <HiSun size={22} /> : <HiMoon size={22} />}
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md flex flex-col gap-4 px-4 py-4 md:hidden">
          {links.map((link, idx) => {
            if (link.role && link.role !== currentUser?.role) return null;
            if (link.guestOnly && currentUser) return null;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`${link.fontBold ? "font-semibold" : ""} hover:text-blue-600 dark:hover:text-blue-400`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {currentUser && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <Link
                href={`/profile/${currentUser.id}`}
                className="relative flex items-center"
                title={currentUser.fullName}
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src={currentUser.profileImage || defaultImage}
                  alt="User Image"
                  width={40}
                  height={40}
                  className="rounded-full border cursor-pointer"
                />
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
