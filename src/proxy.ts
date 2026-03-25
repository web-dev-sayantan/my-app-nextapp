import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type AuthToken = {
  role?: string;
  isActive?: boolean;
  isLocked?: boolean;
};

const adminRoles = new Set(["ADMIN", "SUPER_ADMIN"]);
const moderatorRoles = new Set(["ADMIN", "MODERATOR", "SUPER_ADMIN"]);

function hasAllowedRole(role: string | undefined, allowedRoles: Set<string>) {
  return typeof role === "string" && allowedRoles.has(role);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize certain paths to lowercase to handle case-insensitive requests
  const normalizationPaths = [
    "/courses",
    "/expeditions",
    "/faq",
    "/admin",
    "/moderator",
    "/profile",
    "/dashboard",
  ];
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const shouldNormalize = normalizationPaths.some((p) => lower.startsWith(p));
    if (shouldNormalize) {
      const dest = new URL(lower, request.url);
      return NextResponse.redirect(dest);
    }
  }
  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/dashboard", "/admin", "/moderator"];

  // Admin-only routes
  const adminRoutes = ["/admin"];

  // Moderator-only routes
  const moderatorRoutes = ["/moderator"];

  // Check if current path needs protection
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isModerator = moderatorRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    const token = (await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })) as AuthToken | null;

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    // Allow SUPER_ADMIN to access admin routes as well
    if (isAdmin && !hasAllowedRole(token.role, adminRoles)) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    if (isModerator && !hasAllowedRole(token.role, moderatorRoles)) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    if (token.isLocked) {
      return NextResponse.redirect(new URL("/account-locked", request.url));
    }

    if (token.isActive === false) {
      return NextResponse.redirect(
        new URL("/account-deactivated", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/moderator/:path*",
  ],
};
