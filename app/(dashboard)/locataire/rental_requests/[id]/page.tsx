import { getRentalRequestById } from "@/app/lib/actions";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import RequestDetailPage from "@/app/ui/rental_requests/request-detail-page";

export const metadata = {
  title: "Détail de la demande",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const request = await getRentalRequestById(id);

  return (
    <div>
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Demandes", href: "/admin/rental_requests" },
            {
              label: "Détail de la demande",
              href: `/admin/rental_requests/${request.id}`,
              active: true,
            },
          ]}
        />
      </div>
      <div>
        <RequestDetailPage request={request} />
      </div>
    </div>
  );
}
