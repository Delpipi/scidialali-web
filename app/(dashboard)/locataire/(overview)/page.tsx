import {
  getCurrentUserRentalRequests,
  getLocataireStats,
  getProspectStats,
} from "@/app/lib/actions";
import CardWrapper from "@/app/ui/dashboard/prospect/card-wrapper";
import RentalRequestMinList from "@/app/ui/rental_requests/rental-request-min-list";
import {
  CardsSkeleton,
  DashboardRentalRequestsSkeleton,
} from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard Prospect",
};

export default async function Page() {
  const [stats, result] = await Promise.all([
    getLocataireStats(),
    getCurrentUserRentalRequests({ order_by: "created_at" }),
  ]);

  const rentalRequests = result.data.items || [];
  return (
    <main>
      <div className="mb-medium">
        <h1 className="text-3xl font-bold text-slate-800">
          Tableau de bord Prospect
        </h1>
        <p className="text-slate-600">Consultez les statistiques</p>
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
