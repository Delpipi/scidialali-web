import {
  Users,
  Home,
  Clock,
  MessageSquare,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const iconMap = {
  users: Users,
  estates: Home,
  pending: Clock,
  messages: MessageSquare,
  payment: CreditCard,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
};

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type:
    | "users"
    | "estates"
    | "pending"
    | "messages"
    | "payment"
    | "checkCircle"
    | "alertCircle";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-md p-2 shadow-sm bg-gray-100">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
        <h3 className="ml-2 text-sm text-primary font-bold">{title}</h3>
      </div>
      <p className="truncate rounded-md bg-white px-4 py-8 text-center text-2xl font-bold text-gray-700 border border-gray-200">
        {value}
      </p>
    </div>
  );
}
