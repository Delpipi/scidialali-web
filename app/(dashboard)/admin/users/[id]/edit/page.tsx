import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier un utilisateur",
};

// Import des actions serveur
import { getUser } from "@/app/lib/actions";
import UpdateUserForm from "@/app/ui/users/update-user-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUser(id);

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Utiliseurs", href: "/admin/users" },
          {
            label: "Modifier l'utilisateur",
            href: `/api/admin/users/${id}/edit`,
            active: true,
          },
        ]}
      />

      <UpdateUserForm user={user} />
    </div>
  );
}
