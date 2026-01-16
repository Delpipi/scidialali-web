import { getAllAvailableEstates, getAllEstates } from "@/app/lib/actions";
import EStateItem from "./estate-item";
import { auth } from "@/auth";
import { PublicEstate } from "@/app/lib/definitions";
import Pagination from "../pagination";

interface EstateListProps {
  status?: string;
  type?: string;
  minRent?: number;
  maxRent?: number;
  search?: string;
  currentPage?: number;
}

export default async function EStatesList({
  status,
  type,
  minRent,
  maxRent,
  search,
  currentPage,
}: EstateListProps) {
  const session = await auth();
  let estates: PublicEstate[] = [];
  let totalPages = 1;

  const userRole = session?.user ? session.user.role : "";

  if (!userRole || (userRole && userRole !== "administrateur")) {
    const result = await getAllAvailableEstates({
      type: type,
      order_by: "created_at",
      currentPage: currentPage,
    });
    estates = result?.data?.items || [];
    const total_count = result.data?.total_count || 1;
    const limit = result.data?.limit || 1;
    totalPages = Math.ceil(total_count / limit);
  }

  if (userRole && userRole === "administrateur") {
    const result = await getAllEstates({
      status: Number(status) || 0,
      type: type,
      order_by: "created_at",
      currentPage: currentPage,
    });
    estates = result?.data?.items || [];
    const total_count = result.data?.total_count || 1;
    const limit = result.data?.limit || 1;
    totalPages = Math.ceil(total_count / limit);
  }

  const displayData = estates.filter((estate) => {
    const matchMinRent = minRent
      ? estate.loyer_mensuel >= Number(minRent)
      : true;
    const matchMaxRent = maxRent
      ? estate.loyer_mensuel <= Number(maxRent)
      : true;

    if (!matchMinRent || !matchMaxRent) return false;

    if (!search) return true;

    return (
      estate.titre.toLowerCase().includes(search.toLowerCase()) ||
      estate.adresse.toLowerCase().includes(search.toLowerCase()) ||
      estate.rooms === Number(search) ||
      estate.area === Number(search)
    );
  });

  if (displayData.length === 0) {
    return <p className="text-center py-small">Aucun bien trouvé.</p>;
  }
  return (
    <>
      <div className="grid grid-cols-1 pb-small md:grid-cols-2 lg:grid-cols-3 gap-small">
        {displayData.map((estate) => (
          <EStateItem key={estate.id} estate={estate} userRole={userRole} />
        ))}
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
