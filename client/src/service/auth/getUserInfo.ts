/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandler";
import { User, UserRole } from "@/components/types/user";

export const getUserInfo = async (): Promise<User | null> => {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return null;
    }

    const verifiedToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!verifiedToken) {
      return null;
    }

    const userInfo: User = {
      id: verifiedToken.id ? Number(verifiedToken.id) : 0,
      fullName: verifiedToken.fullName || "Unknown User",
      email: verifiedToken.email || "unknown@example.com",
      role: (verifiedToken.role as UserRole) || null,
      profileImage: verifiedToken.profileImage || null,
      bio: verifiedToken.bio || null,
      currentLocation: verifiedToken.currentLocation || null,
      travelInterests: verifiedToken.travelInterests || [],
      visitedCountries: verifiedToken.visitedCountries || [],
      premium: verifiedToken.premium || false,
    };
    return userInfo;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
