import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier un utilisateur",
};

// Import des actions serveur
import { getUser, getAllBiens } from "@/app/lib/actions";
import UpdateUserForm from "@/app/ui/users/update-user-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let userData;
  let biens;

  try {
    [userData, biens] = await Promise.all([getUser(id), getAllBiens()]);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Utiliseurs", href: "/dashboard/users" },
          {
            label: "Modifier l'utilisateur",
            href: `/dashboard/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div>
        {userData?.user && biens ? (
          <UpdateUserForm user={userData!.user} biens={biens} />
        ) : (
          <div className="text-center">
            <p className="text-gray-600">Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
}
