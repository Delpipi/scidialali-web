import { getAllEstates } from "@/app/lib/actions";
import EStateItem from "./estate-item";

export default async function EStatesList({
  status,
  type,
  query,
  currentPage,
}: {
  status: string;
  type: string;
  query: string;
  currentPage: number;
}) {
  const result = await getAllEstates(currentPage);
  return (
    <div className="grid grid-cols-1 pb-small md:grid-cols-2 lg:grid-cols-3 gap-small">
      {result.estates
        ?.filter(
          (estate) =>
            (!status || estate.status === status) &&
            (!type || estate.type === type) &&
            (!query ||
              estate.titre.toLowerCase().includes(query.toLowerCase()) ||
              estate.adresse.toLowerCase().includes(query.toLowerCase()) ||
              estate.rooms === Number(query) ||
              estate.loyerMensuel === Number(query) ||
              estate.area === Number(query))
        )
        .map((estate) => (
          <EStateItem key={estate.id} estate={estate} />
        ))}
    </div>
  );
}
