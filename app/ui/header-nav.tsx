"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function HeaderNav() {
  const { data: session, status } = useSession();

  const getDashboardLink = () => {
    if (!session?.user) return "/login";

    switch (session.user.role) {
      case "administrateur":
        return "/admin";
      case "locataire":
        return "/locataire";
      default:
        return "/prospect";
    }
  };

  return (
    <nav className="flex items-center gap-4">
      {status === "authenticated" ? (
        <Link href={getDashboardLink()}>Mon espace</Link>
      ) : (
        <Link href="/login">Connexion</Link>
      )}
    </nav>
  );
}
