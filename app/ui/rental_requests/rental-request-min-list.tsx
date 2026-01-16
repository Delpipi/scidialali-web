import { PublicRentalRequest } from "@/app/lib/definitions";
import { formatRelativeDate } from "@/app/lib/utils";
import { MapPin, Home, Calendar } from "lucide-react";
import RentalRequestStatus from "./rental-request-status";

export default function RentalRequestMinList({
  rentalRequests,
}: {
  rentalRequests: PublicRentalRequest[];
}) {
  return (
    <>
      <h2 className="text-xl font-bold text-slate-800 mb-medium">
        Demande de location
      </h2>
      {rentalRequests.length === 0 ? (
        <p className="text-sm">Aucune demande</p>
      ) : (
        rentalRequests.slice(0, 3).map((request: PublicRentalRequest) => {
          const formattedDate = formatRelativeDate(request.created_at);
          return (
            <div
              key={request.id}
              className="group bg-white rounded-md overflow-hidden border border-slate-200 mb-small"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-small">
                  <div className="flex-1 space-y-xsmall">
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

                    <div className="space-y-xsmall pl-1">
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
                  </div>

                  <RentalRequestStatus status={request.status} />
                </div>
              </div>

              <div className="h-1 bg-slate-100">
                <div
                  className={`h-full transition-all duration-500 ${
                    request.status === 0
                      ? "bg-amber-400 w-1/2"
                      : request.status === 1
                      ? "bg-emerald-400 w-full"
                      : "bg-rose-400 w-full"
                  }`}
                />
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
