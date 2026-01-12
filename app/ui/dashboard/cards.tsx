import { getAdminStats } from "@/app/lib/actions";
import { signOut } from "@/auth";
import { Users, Home, Clock, MessageSquare, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

const iconMap = {
  users: Users,
  estates: Home,
  pending: Clock,
  messages: MessageSquare,
  payment: CreditCard,
};

interface StatsProps {
  total_users: number;
  active_tenants: number;
  available_estates: number;
  rented_estates: number;
  pending_requests: number;
  unread_messages: number;
  pending_payments: number;
  late_payments: number;
}

export default async function CardWrapper({ stats }: { stats: StatsProps }) {
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

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "users" | "estates" | "pending" | "messages" | "payment";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-md p-2 shadow-sm bg-primary/5">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
        <h3 className="ml-2 text-sm text-primary font-bold">{title}</h3>
      </div>
      <p className="truncate rounded-md bg-white px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
}
