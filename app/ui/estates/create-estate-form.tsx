"use client";

import { createEstate } from "@/app/lib/actions";
import {
  BanknotesIcon,
  BuildingOffice2Icon,
  H1Icon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { BuildingOfficeIcon } from "@heroicons/react/16/solid";
import { Building2Icon, CircleCheck } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CreateEstateForm() {
  const [formValues, setFormValues] = useState({
    titre: "",
    adresse: "",
    type: "",
    loyer_mensuel: "",
    rooms: "",
    status: "",
    area: "",
  });

  const [state, formAction, isPending] = useActionState(createEstate, {
    status: "idle",
    message: "",
    data: {},
    fieldErrors: {},
    httpStatus: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (state.status == "error" && !state.fieldErrors) {
      toast.error(state.message ?? "");
    }
  });

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Bien Immobilier</h1>
          <p className="text-gray-600">Ajouter un bien</p>
        </div>
        <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800  flex items-center gap-2">
              <Building2Icon className="w-5 h-5 text-slate-800 " />
              Information du bien
            </h2>
          </div>
          <div className="p-6">
            <form action={formAction}>
              <div className="rounded-sm p-xsmall md:p-medium">
                {/* estate titre */}
                <div className="mb-4">
                  <label
                    htmlFor="titre"
                    className="mb-2 block text-sm font-medium"
                  >
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
                    <H1Icon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div id="titre-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.titre &&
                      state.fieldErrors.titre.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* estate address */}
                <div className="mb-4">
                  <label
                    htmlFor="adresse"
                    className="mb-2 block text-sm font-medium"
                  >
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
                    <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div id="adresse-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.adresse &&
                      state.fieldErrors.adresse.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* estate type */}
                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="mb-2 block text-sm font-medium"
                  >
                    Type
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      id="type"
                      required
                      defaultValue="appartement"
                      className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                    >
                      <option value="appartement">Appartement</option>
                      <option value="maison">Maison</option>
                      <option value="bureau">Bureau</option>
                    </select>
                    <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div id="type-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.type &&
                      state.fieldErrors.type.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* estate Loyer Mensuel */}
                <div className="mb-4">
                  <label
                    htmlFor="loyer_mensuel"
                    className="mb-2 block text-sm font-medium"
                  >
                    Loyer Mensuel
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="loyer_mensuel"
                      name="loyer_mensuel"
                      placeholder="Montant du loyer"
                      value={formValues.loyer_mensuel}
                      required
                      onChange={handleChange}
                      className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                    />
                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div
                    id="loyerMensuel-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state?.fieldErrors?.loyer_mensuel &&
                      state.fieldErrors.loyer_mensuel.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* estate rooms */}
                <div className="mb-4">
                  <label
                    htmlFor="contact"
                    className="mb-2 block text-sm font-medium"
                  >
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
                    <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div id="rooms-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.rooms &&
                      state.fieldErrors.rooms.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* estate  status*/}
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium"
                  >
                    Statut
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      id="status"
                      required
                      defaultValue="disponible"
                      className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                    >
                      <option value="0">Disponible</option>
                      <option value="1">Loué</option>
                      <option value="2">Réservé</option>
                    </select>
                    <CircleCheck className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div id="status-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.status &&
                      state.fieldErrors.status.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* estate area */}
                <div className="mb-4">
                  <label
                    htmlFor="area"
                    className="mb-2 block text-sm font-medium"
                  >
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
                    <MapIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div id="area-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.area &&
                      state.fieldErrors.area.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-white py-xsmall cursor-pointer w-full flex justify-center items-center rounded-md"
                >
                  {isPending ? "Ajout..." : "Ajouter utilisateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
