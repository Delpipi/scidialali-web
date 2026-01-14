"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CreateEstate } from "./buttons";
import { useSession } from "next-auth/react";

export default function EstateFilters({
  statusInput,
}: {
  statusInput?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const status = formData.get("status");
    const type = formData.get("type");
    const minRent = formData.get("minRent");
    const maxRent = formData.get("maxRent");
    const search = formData.get("search");

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

    if (minRent) {
      params.set("minRent", `${minRent}`);
    } else {
      params.delete("minRent");
    }

    if (maxRent) {
      params.set("maxRent", `${maxRent}`);
    } else {
      params.delete("maxRent");
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
        {statusInput && (
          <select
            name="status"
            className="border border-gray-300  px-4 py-2 inline-block"
          >
            <option value="">Tous les statuts</option>
            <option value="0">Disponible</option>
            <option value="1">Loué</option>
            <option value="2">Réservé</option>
          </select>
        )}

        <select
          name="type"
          className="w-full px-4 py-2  border border-gray-300  outline-none rounded-sm"
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
          className="w-full px-4 py-2  border border-gray-300 outline-none rounded-sm"
        />

        <input
          type="number"
          name="minRent"
          placeholder="Loyer Min (CFA) Ex: 50000"
          defaultValue={searchParams.get("minRent") || ""}
          className="w-full px-4 py-2 border border-gray-300 outline-none rounded-sm"
        />

        <input
          type="number"
          name="maxRent"
          placeholder="Loyer Max (CFA) Ex: 500000"
          defaultValue={searchParams.get("maxRent") || ""}
          className="w-full px-4 py-2 border border-gray-300 outline-none rounded-sm"
        />

        <button
          type="submit"
          className="bg-primary  text-white font-semibold py-xsmall px-small transition inline-block cursor-pointer rounded-sm"
        >
          <i className="fas fa-search mr-2"></i>Rechercher
        </button>

        {statusInput && <CreateEstate />}
      </form>
    </div>
  );
}
