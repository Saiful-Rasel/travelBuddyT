// NavbarServer.tsx

import { User } from "../types/user";
import NavbarClient from "./navbar";
import { getCookie } from "@/service/auth/tokenHandler";

export default async function NavbarServer() {
  let user: User | null = null;

  try {
    const accessToken = await getCookie("accessToken");


    if (accessToken) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
        {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
      

        if (data.success && data.data) {
          user = data.data;
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch user on server:", err);
    user = null;
  }

  return <NavbarClient currentUser={user} />;
}
