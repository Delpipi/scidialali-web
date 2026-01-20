import EStatesList from "@/app/ui/estates/estate-list";
import FilterItems from "@/app/ui/estates/estate-filters";
import { Metadata } from "next";
import { Suspense } from "react";
import ListLoader from "@/app/ui/loader";

export const metadata: Metadata = {
  title: "Biens Immobiliers",
};

export default async function Page(props: {
  searchParams?: Promise<{
    status?: string;
    type?: string;
    minRent?: string;
    maxRent?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const status = searchParams?.status || "";
  const type = searchParams?.type || "";
  const minRent = Number(searchParams?.minRent) || 0;
  const maxRent = Number(searchParams?.minRent) || 0;
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="w-full">
      <div className="mb-medium">
        <h1 className="text-3xl font-bold text-slate-800">Biens Immobiliers</h1>
        <p className="text-slate-600">Gérez vos biens immobiliers</p>
      </div>
      <div className="flex flex-col mt-xsmall md:flex-row md:justify-between md:mt-small">
        <FilterItems statusInput={true} />
      </div>
      <section className="py-medium">
        <div className="mx-auto px-small">
          <Suspense
            key={type + minRent + maxRent + search + currentPage}
            fallback={<ListLoader />}
          >
            <EStatesList
              status={status}
              type={type}
              minRent={minRent}
              maxRent={maxRent}
              search={search}
              currentPage={currentPage}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
