import { getRentalRequestById } from "@/app/lib/actions";
import RequestDetailPage from "@/app/ui/rental_requests/request-detail-page";


export const metadata = {
  title: "Détail de la demande",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const request = await getRentalRequestById(id);

  return <RequestDetailPage request={request} />;
}
