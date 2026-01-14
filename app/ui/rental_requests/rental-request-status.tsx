import { Clock, CheckCircle2, XCircle } from "lucide-react";

const getStatusConfig = (status: number) => {
  switch (status) {
    case 0:
      return {
        label: "En attente",
        icon: Clock,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        iconColor: "text-amber-500",
        borderColor: "border-amber-200",
      };
    case 1:
      return {
        label: "Approuvé",
        icon: CheckCircle2,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        iconColor: "text-emerald-500",
        borderColor: "border-emerald-200",
      };
    case 2:
      return {
        label: "Refusé",
        icon: XCircle,
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        iconColor: "text-rose-500",
        borderColor: "border-rose-200",
      };
    default:
      return {
        label: "Inconnu",
        icon: Clock,
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
        iconColor: "text-gray-500",
        borderColor: "border-gray-200",
      };
  }
};

export default function RentalRequestStatus({ status }: { status: number }) {
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor} transition-all duration-300`}
    >
      <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
      <span
        className={`text-sm font-semibold ${statusConfig.textColor} whitespace-nowrap`}
      >
        {statusConfig.label}
      </span>
    </div>
  );
}
