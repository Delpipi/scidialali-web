"use client";

import {
  UserGroupIcon,
  HomeIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { HandshakeIcon } from "lucide-react";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const menuAdmin = [
  { name: "Tableau de bord", href: "/admin", icon: HomeIcon },
  {
    name: "Utilisateurs",
    href: "/admin/users",
    icon: UserGroupIcon,
  },
  {
    name: "Demandes",
    href: "/admin/rental_requests",
    icon: HandshakeIcon,
  },
  {
    name: "Biens Immobiliers",
    href: "/admin/estates",
    icon: BuildingOffice2Icon,
  },
];

export default function NavLinks({ user }: { user: any }) {
  const pathname = usePathname();
  return (
    <>
      {user &&
        user.role === "administrateur" &&
        menuAdmin.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex h-12 grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-primary/10 hover:text-primary md:flex-none md:justify-start md:p-xsmall",
                {
                  "bg-primary/10 text-primary ": pathname === link.href,
                }
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        })}
    </>
  );
}
