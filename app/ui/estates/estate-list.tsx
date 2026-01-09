import { getAllEstates } from "@/app/lib/actions";
import EStateItem from "./estate-item";

interface EstateListProps {
  type?: string;
  minRent?: number;
  maxRent?: number;
  search?: string;
  currentPage?: number;
}

export default async function EStatesList({
  type,
  minRent,
  maxRent,
  search,
  currentPage,
}: EstateListProps) {
  const result = await getAllEstates({
    status: 0,
    type: type,
    currentPage: currentPage,
  });

  const estates = result?.data || [];

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
