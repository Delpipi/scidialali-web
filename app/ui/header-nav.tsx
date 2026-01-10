"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LinkButton } from "./button";

export function HeaderNav({ user }: { user: any }) {
  const getDashboardLink = () => {
    if (!user) return "/login";

    switch (user.role) {
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
      {user ? (
        <LinkButton href={getDashboardLink()} variant="outline">
          Dashboard
        </LinkButton>
      ) : (
        <Link href="/login">Connexion</Link>
      )}
    </nav>
  );
}
