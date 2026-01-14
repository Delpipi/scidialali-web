import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter un bien",
};

import Breadcrumbs from "@/app/ui/breadcrumbs";
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
        <CreateEstateForm />
      </div>
    </div>
  );
}
