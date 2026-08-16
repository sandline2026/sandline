import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get("sandline_admin")?.value === "true";
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdmin && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
