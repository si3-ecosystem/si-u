import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";

// Types for JWT payload (matches your AuthUtils TokenPayload)
interface UserJWTPayload {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
  lastLogin?: Date;
  digitalLinks: any[];
  isVerified: boolean;
  newsletter: boolean;
  interests: string[];
  companyName?: string;
  wallet_address?: string;
  personalValues: string[];
  companyAffiliation?: string;
  iat?: number;
  exp?: number;
}

// Define protected and public routes
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/wallet",
  "/notifications",
  "/community",
  "/learning",
  "/projects",
  "/admin",
  "/guide",
  "/partner",
];

// Admin-only routes
const ADMIN_ROUTES = ["/admin"];

// Guide-only routes
const GUIDE_ROUTES = ["/guide"];

// Partner-only routes
const PARTNER_ROUTES = ["/partner"];

// Public auth routes (exact path matching - redirect if already logged in)
const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/signup",
  "/auth/email",
  "/auth/wallet",
  "/verify-email",
  "/connect-wallet",
];

// Main middleware handler
export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip middleware for API routes (except auth routes)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Skip middleware for static files
  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // ✅ Use the passed request for cookie access
  const user = await verifyJwtToken(request);


  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.roles?.includes("admin");
  const isGuide = isAuthenticated && user?.roles?.includes("guide");
  const isPartner = isAuthenticated && user?.roles?.includes("partner");
  const isVerified = isAuthenticated && user?.isVerified;

  // Helper function to get default dashboard based on user role
  const getDefaultDashboard = () => {
    if (isAdmin) return "/dashboard";
    if (isGuide) return "/guide/dashboard";
    if (isPartner) return "/partner/dashboard";
    return "/dashboard";
  };

  // Redirect root path if authenticated and verified
  if (pathname === "/" && isAuthenticated && isVerified) {
    return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
  }

  // Prevent access to login pages if already logged in and verified
  if (PUBLIC_AUTH_ROUTES.includes(pathname) && isAuthenticated && isVerified) {
    return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
  }

  // Handle verification flow - allow access if authenticated but not verified
  if (pathname === "/verify-email") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isVerified) {
      return NextResponse.redirect(new URL(getDefaultDashboard(), request.url));
    }
    return NextResponse.next();
  }

  // Handle wallet connection flow
  if (pathname === "/connect-wallet") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    return NextResponse.next();
  }

  // Check for protected routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    // Must be authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Handle verification requirements based on login method
    if (!isVerified) {
      const hasWalletAddress = !!user?.wallet_address;

      // If user has a wallet address, they can access dashboard without email verification
      // Wallet users authenticate via wallet signature, not email
      if (hasWalletAddress) {
        return NextResponse.next();
      }

      // Email-only users need email verification
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }

    // Check admin routes
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route)) && !isAdmin) {
      return NextResponse.redirect(
        new URL("/error?reason=unauthorized&role=admin", request.url)
      );
    }

    // Check guide routes
    if (
      GUIDE_ROUTES.some((route) => pathname.startsWith(route)) &&
      !isGuide &&
      !isAdmin
    ) {
      return NextResponse.redirect(
        new URL("/error?reason=unauthorized&role=guide", request.url)
      );
    }

    // Check partner routes
    if (
      PARTNER_ROUTES.some((route) => pathname.startsWith(route)) &&
      !isPartner &&
      !isAdmin
    ) {
      return NextResponse.redirect(
        new URL("/error?reason=unauthorized&role=partner", request.url)
      );
    }
  }

  // Allow access to all other routes (public routes like /, /about, /contact, etc.)
  return NextResponse.next();
}

// ✅ JWT Token Verification with Request Scope
async function verifyJwtToken(
  request: NextRequest
): Promise<UserJWTPayload | null> {
  try {
    const jwtCookie = request.cookies.get("si3-jwt");

    if (!jwtCookie?.value) {
      console.log("No JWT cookie found");
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set");
      return null;
    }

    // Additional validation for the token format
    const tokenParts = jwtCookie.value.split(".");
    if (tokenParts.length !== 3) {
      console.error(
        "Invalid JWT format - token should have 3 parts separated by dots"
      );
      return null;
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify<UserJWTPayload>(
      jwtCookie.value,
      secret
    );

    return payload;
  } catch (err) {
    // More detailed error logging
    if (err instanceof Error) {
      console.error("JWT verification failed:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
    } else {
      console.error("JWT verification failed with unknown error:", err);
    }

    // Clear the invalid cookie by returning null
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|icons).*)",
  ],
};
