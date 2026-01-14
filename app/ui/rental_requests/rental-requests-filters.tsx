"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RentalRequestFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const status = formData.get("status");
    const search = formData.get("search");

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (status) {
      params.set("status", `${status}`);
    } else {
      params.delete("status");
    }

    if (search) {
      params.set("search", `${search}`);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="bg-gray-50 rounded-sm p-xsmall mb-small">
      <form
        onSubmit={handleFilter}
        className="flex flex-col md:flex-row justify-evenly gap-xsmall"
      >
        <select
          name="status"
          className="w-full px-4 py-2  border border-gray-300  outline-none rounded-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="0">En attente</option>
          <option value="1">Approuvé</option>
          <option value="2">Refusé</option>
        </select>
        <input
          type="text"
          name="search"
          placeholder="Rechercher..."
          className="w-full px-4 py-2  border border-gray-300 outline-none rounded-sm"
        />

        <button
          type="submit"
          className="bg-primary  text-white font-semibold py-xsmall px-small transition inline-block cursor-pointer rounded-sm"
        >
          <i className="fas fa-search mr-2"></i>Rechercher
        </button>
      </form>
    </div>
  );
}
