import Search from "@/app/ui/search";
import UsersTable from "@/app/ui/users/users-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const seachParams = await props.searchParams;
  const search = seachParams?.search || "";
  const currentPage = Number(seachParams?.page) || 1;
  return (
    <div className="w-full">
      <div className="mb-medium">
        <h1 className="text-3xl font-bold text-slate-800">Utilisateurs</h1>
        <p className="text-slate-600">Gérez les utilisateurs</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Recherche..." />
      </div>
      <UsersTable search={search} currentPage={currentPage} />
    </div>
  );
}
