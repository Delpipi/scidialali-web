import { ProspectStats } from "@/app/lib/definitions";
import { Card } from "../../card";

export default async function CardWrapper({ stats }: { stats: ProspectStats }) {
  return (
    <>
      <Card
        title="Biens disponibles"
        value={stats.available_estates}
        type="estates"
      />
      <Card
        title="Biens Réjétés"
        value={stats.reject_rented_estates}
        type="estates"
      />
      <Card
        title="Demandes en attente"
        value={stats.pending_requests}
        type="pending"
      />
    </>
  );
}
