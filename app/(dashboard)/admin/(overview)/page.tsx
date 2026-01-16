// app/admin/page.tsx - KEEP IT SIMPLE

import { getAdminStats, getAllRentalRequest } from "@/app/lib/actions";
import { PublicRentalRequest } from "@/app/lib/definitions";
import CardWrapper from "@/app/ui/dashboard/admin/card-wrapper";
import {
  CardsSkeleton,
  DashboardRentalRequestsSkeleton,
} from "@/app/ui/skeletons";
import { Suspense } from "react";
import RentalRequestMinList from "@/app/ui/rental_requests/rental-request-min-list";

export const metadata = {
  title: "Dashboard Adminsitrateur",
};

export default async function Page() {
  const [stats, result] = await Promise.all([
    getAdminStats(),
    getAllRentalRequest({ order_by: "created_at" }),
  ]);

  const rentalRequests = result.data.items || [];

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
        <Suspense key="result" fallback={<DashboardRentalRequestsSkeleton />}>
          <RentalRequestMinList rentalRequests={rentalRequests} />
        </Suspense>
      </div>
    </main>
  );
}
