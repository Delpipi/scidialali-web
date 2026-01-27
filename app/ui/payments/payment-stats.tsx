import { Card } from "../card";

interface StatsProps {
  stats: {
    paid: number;
    pending: number;
    late: number;
  };
}
export default function PaymentStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card title="Payés" value={stats.paid} type="checkCircle" />
      <Card title="En attente" value={stats.pending} type="pending" />
      <Card title="En retard" value={stats.late} type="alertCircle" />
    </div>
  );
}
