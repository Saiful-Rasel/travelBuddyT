/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./tokenHandler";
import { UserRole } from "@/components/types/user";

const loginValidationSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const loginUser = async (
  currentState: any,
  formData: any
): Promise<any> => {
 
  let accessTokenObject: null | any = null;
  let refreshTokenObject: null | any = null;
  try {
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatesData = loginValidationSchema.safeParse(loginData);
    if (!validatesData.success) {
      return {
        success: false,
        errors: validatesData.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const data = await response.json();
    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    if (!refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge:
        parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    const verifiedToken: JwtPayload | string = jwt.verify(
      accessTokenObject.accessToken,
      process.env.JWT_SECRET as string
    );

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userRole: UserRole = verifiedToken.role;

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }
  const redirect = formData.get("redirect") as string | null;
    const redirectUrl = redirect
      ? redirect
      : userRole === "ADMIN"
      ? "/dashboard/admin"
      : "/dashboard";
    return { success: true, redirectUrl };
    //  return data
  } catch (error) {
    console.log(error);
    return { success: false, message: "Login failed" };
  }
};
