import { getEstate } from "@/app/lib/actions";
import CreateRentalRequestForm from "@/app/ui/rental_requests/rental-estate-form";
import { auth } from "@/auth";

export const metadata = {
  title: "Faire une demande",
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const [estate, session] = await Promise.all([getEstate(id), auth()]);
  console.log(session?.user);

  if (!estate.data || !session?.user) return;

  return (
    <CreateRentalRequestForm estate={estate.data} userId={session?.user.id} />
  );
}
