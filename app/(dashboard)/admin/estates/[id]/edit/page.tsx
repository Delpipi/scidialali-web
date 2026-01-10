import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier le bien",
};

// Import des actions serveur
import { getEstate } from "@/app/lib/actions";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import UpdateEstateForm from "@/app/ui/estates/update-estate-form";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let estate;

  try {
    estate = await getEstate(id);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Utiliseurs", href: "/dashboard/users" },
          {
            label: "Modifier le bien immobilier",
            href: `/dashboard/estates/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div>
        {estate?.user ? (
          <UpdateEstateForm estate={estate.user} gestionnaires={[]} />
        ) : (
          <div className="text-center">
            <p className="text-gray-600">Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
}
