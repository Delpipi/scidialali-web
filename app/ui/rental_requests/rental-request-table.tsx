import { getAllRentalRequest, getAllUsers } from "@/app/lib/actions";
import { PublicRentalRequest } from "@/app/lib/definitions";
import { formatRelativeDate } from "@/app/lib/utils";
import { Calendar, Home, MapPin, SmartphoneIcon } from "lucide-react";
import RentalRequestStatus from "./rental-request-status";
import { DeleteRentalRequest, ViewRentalRequest } from "../buttons";
import Pagination from "../pagination";

interface TableProps {
  status?: string;
  search?: string;
  currentPage?: number;
}

export default async function RentalRequestTable({
  status,
  search,
  currentPage,
}: TableProps) {
  const result = await getAllRentalRequest({
    status: status === "" ? undefined : Number(status),
    order_by: "created_at",
    currentPage: currentPage,
  });

  const rentalRequests = result.data.items || [];
  const totalPages = Math.ceil(result.data.total_count / result.data.limit);

  const displayData = rentalRequests.filter((request) => {
    if (!search) return true;
    return (
      request.user?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      request.user?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      request.estate?.titre?.toLowerCase().includes(search.toLowerCase()) ||
      request.estate?.adresse?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (displayData.length === 0) {
    return <p className="text-center py-small">Aucune demande trouvée.</p>;
  }

  return (
    <div className="mt-small flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-primary/10 p-xsmall md:pt-0">
          <div className="md:hidden">
            {displayData.map((request) => {
              const formattedDate = formatRelativeDate(request.created_at);
              return (
                <div
                  key={request.id}
                  className="mb-2 w-full rounded-md bg-white p-xsmall"
                >
                  <div className="flex items-center justify-between border-b border-primary pb-xsmall">
                    <div>
                      <div className="flex items-center gap-xsmall">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            request.status === 0
                              ? "bg-amber-400"
                              : request.status === 1
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          } flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                        >
                          {request.user?.prenom?.[0]?.toUpperCase() || "?"}
                          {request.user?.nom?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-base">
                            {request.user?.prenom} {request.user?.nom}
                          </p>
                          {formattedDate && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-xsmall">
                        <Home className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {request.estate?.titre}
                        </p>
                      </div>
                      <div className="flex items-start gap-xsmall">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-500">
                          {request.estate?.adresse}
                        </p>
                      </div>
                    </div>
                    <RentalRequestStatus status={request.status} />
                  </div>
                  <div className="flex justify-end gap-2 mt-xsmall">
                    <ViewRentalRequest id={request.id} />
                    <DeleteRentalRequest id={request.id} />
                  </div>
                </div>
              );
            })}
          </div>
          <table className="hidden min-w-full md:table">
            <thead className="rounded-md text-left text-sm font-normal text-primary">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nom et Prenom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Bien
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Adresse du bien
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Operation</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayData.map((request) => {
                const formattedDate = formatRelativeDate(request.created_at);
                return (
                  <tr
                    key={request.user?.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-xsmall">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            request.status === 0
                              ? "bg-amber-400"
                              : request.status === 1
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          } flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                        >
                          {request.user?.prenom?.[0]?.toUpperCase() || "?"}
                          {request.user?.nom?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-base">
                            {request.user?.prenom} {request.user?.nom}
                          </p>
                          {formattedDate && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-start gap-xsmall">
                        <SmartphoneIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {request.user?.contact}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-start gap-xsmall">
                        <Home className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {request.estate?.titre}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-start gap-xsmall">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-500">
                          {request.estate?.adresse}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <RentalRequestStatus status={request.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-2">
                        <ViewRentalRequest id={request.id} />
                        <DeleteRentalRequest id={request.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
