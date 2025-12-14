"use client";

import { useState } from "react";
import { deleteCookie } from "@/service/auth/tokenHandler";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  redirectTo?: string;
  className?: string;
}

export default function LogoutButton({
  redirectTo = "/login",
  className = "",
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");

      toast.success("Logged out successfully 👋");

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1200);
    } catch {
      toast.error("Logout failed!");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        group flex items-center gap-2
        rounded-xl px-4 py-2
        bg-gradient-to-r from-red-500 to-pink-500
        text-white font-semibold
        shadow-lg shadow-red-500/30
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <span className="animate-pulse">Logging out...</span>
      ) : (
        <>
          <LogOut
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
          Logout
        </>
      )}
    </button>
  );
}
