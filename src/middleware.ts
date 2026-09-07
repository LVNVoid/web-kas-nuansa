import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, AuthServiceImpl } from "@/infrastructure/services/auth.service.impl";

const authService = new AuthServiceImpl();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isValid = false;
  if (token) {
    const session = await authService.verifySessionToken(token);
    isValid = session !== null;
  }

  // 1. Proteksi rute admin
  if (pathname.startsWith("/admin")) {
    if (!isValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Jika sudah login dan membuka /login, redirect ke /admin/blocks
  if (pathname === "/login" && isValid) {
    return NextResponse.redirect(new URL("/admin/blocks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
