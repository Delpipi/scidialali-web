import RentalRequestTable from "@/app/ui/rental_requests/rental-request-table";
import RentalRequestFilters from "@/app/ui/rental_requests/rental-requests-filters";
import Table from "@/app/ui/users/users-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

export default async function Page(props: {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const seachParams = await props.searchParams;
  const status = Number(seachParams?.status) || 0;
  const search = seachParams?.search || "";
  const currentPage = Number(seachParams?.page) || 1;
  return (
    <div className="w-full">
      <div className="mb-medium">
        <h1 className="text-3xl font-bold text-slate-800">
          Demande de location
        </h1>
        <p className="text-slate-600">
          Gérez les demandes de location et consultez les statistiques
        </p>
      </div>
      <div>
        <RentalRequestFilters />
      </div>
      <RentalRequestTable
        status={status}
        search={search}
        currentPage={currentPage}
      />
    </div>
  );
}
