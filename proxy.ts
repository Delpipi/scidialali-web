// proxy.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 1. On définit la fonction nommée "proxy" comme attendu par Next.js 16
async function proxy(req: any) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isDashboardRoute =
    nextUrl.pathname.startsWith("/admin") ||
    nextUrl.pathname.startsWith("/locataire") ||
    nextUrl.pathname.startsWith("/prospect") ||
    nextUrl.pathname.startsWith("/dashboard");

  const isAuthRoute = nextUrl.pathname.startsWith("/login");

  // Logique de redirection
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    // Redirection vers ton Dispatcher par rôle
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
}

// 2. On exporte la fonction proxy wrappée par Auth.js
export default auth(proxy);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
