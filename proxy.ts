// middleware.ts  (à la racine du projet)
import { auth } from "@/auth"; // ton fichier d'export auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function middleware(req: NextRequest) {
  const session = await auth();
  const { nextUrl } = req;

  const isLoggedIn = !!session?.user;

  // 1. Routes protégées par rôle
  const adminPaths = ["/admin", "/admin/"];
  const locatairePaths = ["/locataire", "/locataire/"];
  const prospectPaths = ["/prospect", "/prospect/"]; // si besoin

  const isAdminRoute = adminPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );
  const isLocataireRoute = locatairePaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );
  const isProspectRoute = prospectPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  const isAuthPage = nextUrl.pathname.startsWith("/login");

  // 2. Cas 1 : utilisateur NON connecté → on protège les routes dashboard
  if ((isAdminRoute || isLocataireRoute || isProspectRoute) && !isLoggedIn) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl)
    );
  }

  // 3. Cas 2 : utilisateur CONNECTÉ → redirection intelligente après login
  if (isLoggedIn && isAuthPage) {
    const role = (session?.user as any)?.role?.toLowerCase?.(); // adapte selon ton type

    if (!session?.user) {
      throw new Error("Session introuvale");
    }

    // Dispatcher par rôle - adapte les chemins selon ton projet
    switch (session.user.role) {
      case "administrateur":
        return NextResponse.redirect(new URL("/admin", nextUrl));
      case "locataire":
        return NextResponse.redirect(new URL("/locataire", nextUrl));
      case "prospect":
        return NextResponse.redirect(new URL("/prospect", nextUrl));

      default:
        // fallback - ou page d'erreur / accueil
        return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Tout est OK → on continue
  return NextResponse.next();
}

// Export avec le wrapper auth (important pour v5 !)
export default auth(middleware);

// Matcher - attention aux exclusions
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
