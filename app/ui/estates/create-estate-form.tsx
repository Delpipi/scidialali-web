"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/app/ui/button";
import { createEstate } from "@/app/lib/actions";
import { User } from "firebase/auth";
import {
  BanknotesIcon,
  BuildingOffice2Icon,
  H1Icon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { BuildingOfficeIcon } from "@heroicons/react/16/solid";
import { CircleCheck } from "lucide-react";

export default function CreateEstateForm({
  gestionnaires,
}: {
  gestionnaires: User[];
}) {
  const [formValues, setFormValues] = useState({
    titre: "",
    adresse: "",
    type: "",
    loyerMensuel: "",
    rooms: "",
    status: "",
    area: "",
  });

  const [state, formAction, isPending] = useActionState(createEstate, {
    errors: {},
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form action={formAction}>
      <div className="rounded-sm bg-gray-50 p-xsmall md:p-medium">
        {/* estate titre */}
        <div className="mb-4">
          <label htmlFor="titre" className="mb-2 block text-sm font-medium">
            Titre
          </label>
          <div className="relative">
            <input
              type="text"
              id="titre"
              name="titre"
              placeholder="Titre"
              value={formValues.titre}
              required
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <H1Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="titre-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.titre &&
              state.errors.titre.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* estate address */}
        <div className="mb-4">
          <label htmlFor="adresse" className="mb-2 block text-sm font-medium">
            Adresse
          </label>
          <div className="relative">
            <input
              type="text"
              id="adresse"
              name="adresse"
              placeholder="Adresse"
              value={formValues.adresse}
              required
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="adresse-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.adresse &&
              state.errors.adresse.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* estate type */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <div className="relative">
            <select
              name="type"
              id="type"
              required
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            >
              <option value="appartement" selected>
                Appartement
              </option>
              <option value="maison">Maison</option>
              <option value="bureau">Bureau</option>
            </select>
            <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* estate Loyer Mensuel */}
        <div className="mb-4">
          <label
            htmlFor="loyerMensuel"
            className="mb-2 block text-sm font-medium"
          >
            Loyer Mensuel
          </label>
          <div className="relative">
            <input
              type="number"
              id="loyerMensuel"
              name="loyerMensuel"
              placeholder="Montant du loyer"
              value={formValues.loyerMensuel}
              required
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="loyerMensuel-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.loyerMensuel &&
              state.errors.loyerMensuel.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* estate rooms */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
            Nombre de Chambres
          </label>
          <div className="relative">
            <input
              type="number"
              id="rooms"
              name="rooms"
              placeholder="Nombre de Chambres"
              value={formValues.rooms}
              required
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="rooms-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.rooms &&
              state.errors.rooms.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* estate  status*/}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Statut
          </label>
          <div className="relative">
            <select
              name="status"
              id="status"
              required
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            >
              <option value="disponible" selected>
                disponible
              </option>
              <option value="loué">Loué</option>
              <option value="réservé">Réservé</option>
            </select>
            <CircleCheck className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* estate area */}
        <div className="mb-4">
          <label htmlFor="area" className="mb-2 block text-sm font-medium">
            Superficie
          </label>
          <div className="relative">
            <input
              type="number"
              id="area"
              name="area"
              placeholder="Superficie du bien.ex: 200"
              value={formValues.area}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="area-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.area &&
              state.errors.area.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Global error */}
      <div aria-live="polite" aria-atomic="true">
        {state?.message ? (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        ) : (
          ""
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="w-full h-10 rounded-lg bg-gray-100 text-sm flex 
          justify-center items-center
          font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Annuler
        </Link>
        <Button
          type="submit"
          disabled={isPending}
          className="cursor-pointer w-full flex 
          justify-center items-center"
        >
          {isPending ? "ajout..." : "Ajouter utilisateur"}
        </Button>
      </div>
    </form>
  );
}
