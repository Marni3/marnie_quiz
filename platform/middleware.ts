import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthPage = nextUrl.pathname.startsWith("/login");
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
  const isStatic =
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/favicon.ico") ||
    nextUrl.pathname.includes(".");

  if (isApiAuth || isStatic) {
    return NextResponse.next();
  }

  // Allow guest access to view quizzes, questions, and take attempts
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/quizzes") ||
    nextUrl.pathname.startsWith("/attempts") ||
    nextUrl.pathname.startsWith("/modules") ||
    nextUrl.pathname.startsWith("/api/quizzes") ||
    nextUrl.pathname.startsWith("/api/attempts");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/quizzes", nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect root to /quizzes
  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/quizzes", nextUrl));
  }

  // If user tries to access private routes like /history, allow or redirect
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.next(); // allow smooth guest exploration
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
