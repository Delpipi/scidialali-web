import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter un bien",
};

// Import des actions serveur
import { getEstate } from "@/app/lib/actions";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import UpdateEstateForm from "@/app/ui/estates/update-estate-form";
import CreateEstateForm from "@/app/ui/estates/create-estate-form";

export default async function Page() {
  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Biens Immobiliers", href: "/dashboard/estates" },
          {
            label: "Ajouter un bien immobilier",
            href: `/dashboard/estates/create`,
            active: true,
          },
        ]}
      />
      <div>
        <CreateEstateForm gestionnaires={[]} />
      </div>
    </div>
  );
}
