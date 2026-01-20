import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier le bien",
};

// Import des actions serveur
import { getAllUsers, getEstate } from "@/app/lib/actions";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import UpdateEstateForm from "@/app/ui/estates/update-estate-form";
import { PublicEstate } from "@/app/lib/definitions";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [estate, result] = await Promise.all([
    getEstate(id),
    getAllUsers({
      role: "admin",
      order_by: "created_at",
      currentPage: 1,
    }),
  ]);

  const users = result.data.items || [];

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Bien immobiliers", href: "/admin/estates" },
          {
            label: "Modifier le bien immobilier",
            href: `/dashboard/estates/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div>
        <UpdateEstateForm
          estate={estate.data as PublicEstate}
          gestionnaires={users}
        />
      </div>
    </div>
  );
}
