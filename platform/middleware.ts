import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isStatic =
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/favicon.ico") ||
    nextUrl.pathname.includes(".");

  if (isStatic) {
    return NextResponse.next();
  }

  // Redirect root / to /quizzes
  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/quizzes", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
