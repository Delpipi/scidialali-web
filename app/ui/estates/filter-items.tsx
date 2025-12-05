"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FilterItems() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const status = formData.get("status");
    const type = formData.get("type");
    const query = formData.get("search");

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (status) {
      params.set("status", `${status}`);
    } else {
      params.delete("status");
    }

    if (type) {
      params.set("type", `${type}`);
    } else {
      params.delete("type");
    }

    if (query) {
      params.set("query", `${query}`);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="bg-gray-50 rounded-lg p-xsmall mb-small">
      <form
        onSubmit={handleFilter}
        className="flex md:flex-col lg:flex-row justify-evenly gap-xsmall"
      >
        <select
          name="status"
          className="border border-gray-300 rounded-lg px-4 py-2 inline-block"
        >
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="loué">Loué</option>
          <option value="réservé">Réservé</option>
        </select>
        <select
          name="type"
          className="border border-gray-300 rounded-lg px-4 py-2 inline-block"
        >
          <option value="">Tous les types</option>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
          <option value="bureau">Bureau</option>
        </select>
        <input
          type="text"
          name="search"
          placeholder="Rechercher..."
          className="border border-gray-300 rounded-lg px-4 py-2 inline-block"
        />
        <button
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition inline-block"
        >
          <i className="fas fa-search mr-2"></i>Rechercher
        </button>
      </form>
    </div>
  );
}
