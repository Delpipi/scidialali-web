import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modifier un utilisateur",
};

// Import des actions serveur
import { getUser } from "@/app/lib/actions";
import UpdateUserForm from "@/app/ui/users/update-user-form";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user) return;

  const user = await getUser(session.user.id);

  return (
    <div className="w-full">
      <div className="mb-medium">
        <h1 className="text-3xl font-bold text-slate-800">Mon Profile</h1>
        <p className="text-slate-600">Gérez votre profile et vos documents</p>
      </div>
      <UpdateUserForm user={user} />
    </div>
  );
}
