import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Clock } from "lucide-react";

const getStatusConfig = (status: boolean) => {
  switch (status) {
    case true:
      return {
        label: "Actif",
        icon: CheckIcon,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        iconColor: "text-emerald-500",
        borderColor: "border-emerald-200",
      };
    case false:
      return {
        label: "Inactif",
        icon: ClockIcon,
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

export default function RentalRequestStatus({ status }: { status: boolean }) {
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
