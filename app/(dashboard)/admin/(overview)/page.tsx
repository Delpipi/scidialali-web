// app/admin/page.tsx - KEEP IT SIMPLE

import { getAdminStats, getAllRentalRequest } from "@/app/lib/actions";
import { PublicRentalRequest } from "@/app/lib/definitions";
import CardWrapper from "@/app/ui/dashboard/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Home,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

const getStatusConfig = (status: number) => {
  switch (status) {
    case 0:
      return {
        label: "En attente",
        icon: Clock,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        iconColor: "text-amber-500",
        borderColor: "border-amber-200",
      };
    case 1:
      return {
        label: "Approuvé",
        icon: CheckCircle2,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        iconColor: "text-emerald-500",
        borderColor: "border-emerald-200",
      };
    case 2:
      return {
        label: "Refusé",
        icon: XCircle,
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        iconColor: "text-rose-500",
        borderColor: "border-rose-200",
      };
    default:
      return {
        label: "Inconnu",
        icon: Clock,
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        iconColor: "text-gray-500",
        borderColor: "border-gray-200",
      };
  }
};

// Fonction simple pour formater la date
function formatRelativeDate(
  date: string | Date | null | undefined
): string | null {
  if (!date) return null;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays === 1) return "Il y a 1 jour";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

    return dateObj.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return null;
  }
}

export default async function Page() {
  const stats = await getAdminStats();
  const result = await getAllRentalRequest({ order_by: "created_at" });

  const rental_requests = result.data.items || [];

  return (
    <main>
      <div className="mb-medium">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord Admin
        </h1>
        <p className="text-slate-600">
          Gérez les demandes de location et consultez les statistiques
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense key="stats" fallback={<CardsSkeleton />}>
          <CardWrapper stats={stats} />
        </Suspense>
      </div>
      <div className="my-medium">
        <h2 className="text-xl font-bold text-slate-800 mb-medium">
          Demande de location
        </h2>
        {rental_requests.length === 0 ? (
          <p className="text-sm">Aucune demande</p>
        ) : (
          rental_requests.slice(0, 3).map((request: PublicRentalRequest) => {
            const statusConfig = getStatusConfig(request.status);
            const formattedDate = formatRelativeDate(request.created_at);
            const StatusIcon = statusConfig.icon;
            return (
              <div
                key={request.id}
                className="group bg-white rounded-md overflow-hidden border border-slate-200"
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

                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor} transition-all duration-300`}
                    >
                      <StatusIcon
                        className={`w-4 h-4 ${statusConfig.iconColor}`}
                      />
                      <span
                        className={`text-sm font-semibold ${statusConfig.textColor} whitespace-nowrap`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
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
      </div>
    </main>
  );
}
