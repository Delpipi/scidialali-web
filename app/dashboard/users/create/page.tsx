import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateForm from "@/app/ui/users/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter un utilisateur",
};

export default async function Page() {
  return (
    <main className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Utiliseurs", href: "/dashboard/users" },
          {
            label: "Ajouter un utilisateur",
            href: "/dashboard/users/create",
            active: true,
          },
        ]}
      />
      <div>
        <CreateForm />
      </div>
    </main>
  );
}
