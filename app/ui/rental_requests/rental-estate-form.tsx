"use client";

import { createRentalRentalRequest } from "@/app/lib/actions";
import { PublicEstate } from "@/app/lib/definitions";
import { formatCurrency } from "@/app/lib/utils";
import { Building2Icon, DoorOpen, Home, MapPin, Ruler } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CreateRentalRequestForm({
  estate,
}: {
  estate: PublicEstate;
  userId: string;
}) {
  const [formValues, setFormValues] = useState({
    estate_id: "",
    message: "",
  });

  const [state, formAction, isPending] = useActionState(
    createRentalRentalRequest,
    {
      status: "idle",
      message: "",
      data: {},
      fieldErrors: {},
      httpStatus: 0,
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (state.status == "error" && !state.fieldErrors) {
      toast.error(state.message ?? "");
    }
  }, [state]);

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-4 md:p-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Demande de location
        </h1>
        <p className="text-gray-600">Faite une demande de location</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-small">
        <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800  flex items-center gap-2">
              <Building2Icon className="w-5 h-5 text-slate-800 " />
              Ma demande pour le bien
            </h2>
          </div>
          <div className="p-6">
            <form action={formAction}>
              <div className="rounded-sm p-xsmall md:p-medium">
                <input
                  type="hidden"
                  id="estate_id"
                  name="estate_id"
                  value={estate.id}
                  required
                />

                <div className="mb-4">
                  <label
                    htmlFor="adresse"
                    className="mb-2 block text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Votre message"
                    value={formValues.message}
                    rows={10}
                    required
                    onChange={handleChange}
                    className="px-small py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                  />
                  <div id="adresse-error" aria-live="polite" aria-atomic="true">
                    {state?.fieldErrors?.message &&
                      state.fieldErrors.message.map((error: string) => (
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
                  className="bg-primary/60 hover:bg-primary text-white py-xsmall cursor-pointer w-full flex justify-center items-center rounded-md"
                >
                  {isPending ? "Envoie..." : "Faire ma demande"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-slate-600" />
                Le bien
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 text-lg mb-2">
                  {estate.titre}
                </h3>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 mt-1 shrink-0" />
                  <p className="text-sm">{estate.adresse}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Type</span>
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {estate.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Chambres</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {estate.rooms}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Surface</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {estate.area} m²
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Loyer mensuel</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(estate.loyer_mensuel || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
