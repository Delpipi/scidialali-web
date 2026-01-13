import { CreateEstate } from "@/app/ui/estates/buttons";
import EStatesList from "@/app/ui/estates/estate-list";
import FilterItems from "@/app/ui/estates/estate-filters";
import Search from "@/app/ui/search";
import { CreateUser } from "@/app/ui/users/buttons";
import Table from "@/app/ui/users/users-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biens Immobiliers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    status?: string;
    type?: string;
    minRent?: number;
    maxRent?: number;
    search?: string;
    page?: string;
  }>;
}) {
  const seachParams = await props.searchParams;
  console.log(`SEACHPARAMS ${seachParams?.status}`);
  const status = seachParams?.status || "";
  const type = seachParams?.type || "";
  const minRent = seachParams?.minRent || "";
  const maxRent = seachParams?.maxRent || "";
  const query = seachParams?.search || "";
  const currentPage = Number(seachParams?.page) || 1;
  return (
    <div className="w-full">
      <h1 className="text-2xl">Biens Immobiliers</h1>
      <div className="flex flex-col mt-xsmall md:flex-row md:justify-between md:mt-small">
        <FilterItems />
        <CreateEstate />
      </div>
    </div>
  );
}
