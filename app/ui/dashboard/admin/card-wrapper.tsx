import { AdminStats } from "@/app/lib/definitions";
import { Card } from "../../card";

export default async function CardWrapper({ stats }: { stats: AdminStats }) {
  return (
    <>
      <Card title="Total utilisateurs" value={stats.total_users} type="users" />
      <Card
        title="Locataires actifs"
        value={stats.active_tenants}
        type="users"
      />
      <Card
        title="Biens disponibles"
        value={stats.available_estates}
        type="estates"
      />
      <Card title="Biens loués" value={stats.rented_estates} type="estates" />
      <Card
        title="Demandes en attente"
        value={stats.pending_requests}
        type="pending"
      />
      <Card
        title="Messages non lus"
        value={stats.unread_messages}
        type="messages"
      />
      <Card
        title="Paiements en attente"
        value={stats.pending_payments}
        type="pending"
      />
      <Card
        title="Paiements en retard"
        value={stats.late_payments}
        type="payment"
      />
    </>
  );
}
