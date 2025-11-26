import Search from "@/app/ui/search";
import { CreateUser } from "@/app/ui/users/buttons";
import Table from "@/app/ui/users/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const seachParams = await props.searchParams;
  const query = seachParams?.query || "";
  const currentPage = Number(seachParams?.page) || 1;
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Utilisateurs</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Recherche..." />
        <CreateUser />
      </div>
      <Table query={query} currentPage={currentPage} />
    </div>
  );
}
