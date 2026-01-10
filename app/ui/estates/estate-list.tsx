import { getAllAvailableEstates, getAllEstates } from "@/app/lib/actions";
import EStateItem from "./estate-item";
import { auth } from "@/auth";
import { PublicEstate } from "@/app/lib/definitions";

interface EstateListProps {
  status?: number;
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

  if (!session?.user) {
    const result = await getAllAvailableEstates({
      type: type,
      currentPage: currentPage,
    });
    estates = result?.data || [];
  }

  if (session?.user && session.user.role === "administrateur") {
    const result = await getAllEstates({
      status: status,
      type: type,
      currentPage: currentPage,
    });
    estates = result?.data || [];
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
    <div className="grid grid-cols-1 pb-small md:grid-cols-2 lg:grid-cols-3 gap-small">
      {displayData.map((estate) => (
        <EStateItem key={estate.id} estate={estate} />
      ))}
    </div>
  );
}
