import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "./components/types/user";



// Auth routes accessible without login
const authRoutes = ["/login", "/register"];

// Protected routes for logged-in users
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

// Default dashboard route by role
const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "USER") return "/dashboard";
  return "/";
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieStore = await cookies();

  const accessToken = request.cookies.get("accessToken")?.value || null;

  let userRole: UserRole = null;

  // 1️⃣ Verify token if exists
  if (accessToken) {
    try {
      const decoded: JwtPayload | string = jwt.verify(
        accessToken,
        process.env.JWT_SECRET as string
      );

      if (typeof decoded === "string") throw new Error("Invalid token");

      userRole = decoded.role as UserRole;
    } catch (err) {
      // Invalid token → delete cookies & redirect login
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const isAuthPage = authRoutes.includes(pathname);
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 2️⃣ Logged-in user visiting login/register → redirect to their dashboard
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url)
    );
  }

  // 3️⃣ Not logged in & trying to access protected route → redirect login
  if (!accessToken && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4️⃣ Logged-in & visiting role-protected dashboard
  if (accessToken && pathname.startsWith("/dashboard")) {
    if (userRole === "ADMIN" && pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
    if (userRole === "USER" && pathname === "/dashboard/admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
