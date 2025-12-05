import { CreateEstate } from "@/app/ui/estates/buttons";
import EStatesList from "@/app/ui/estates/estate-list";
import FilterItems from "@/app/ui/estates/filter-items";
import Search from "@/app/ui/search";
import { CreateUser } from "@/app/ui/users/buttons";
import Table from "@/app/ui/users/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biens Immobiliers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    status?: string;
    type?: string;
    query?: string;
    page?: string;
  }>;
}) {
  const seachParams = await props.searchParams;
  console.log(`SEACHPARAMS ${seachParams?.status}`);
  const status = seachParams?.status || "";
  const type = seachParams?.type || "";
  const query = seachParams?.query || "";
  const currentPage = Number(seachParams?.page) || 1;
  return (
    <div className="w-full">
      <h1 className="text-2xl">Biens Immobiliers</h1>
      <div className="flex flex-col mt-xsmall md:flex-row md:justify-between md:mt-small">
        <FilterItems />
        <CreateEstate />
      </div>
      <EStatesList
        status={status}
        type={type}
        query={query}
        currentPage={currentPage}
      />
    </div>
  );
}
