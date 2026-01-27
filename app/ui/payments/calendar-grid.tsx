import { PaymentStatus, PublicPayment } from "@/app/lib/definitions";
import { getStatusColor } from "@/app/lib/utils";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface CalendarGridProps {
  days: (number | null)[];
  paymentsByDay: { [Key: number]: PublicPayment[] };
  onSelectPayment: (payment: PublicPayment) => void;
  onDateClick: (day: number) => void;
}

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.paid:
      return <CheckCircle className="w-4 h-4" />;
    case PaymentStatus.late:
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export function CalendarGrid({
  days,
  paymentsByDay,
  onSelectPayment,
  onDateClick,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dayPayments = day ? paymentsByDay[day] || [] : [];
        return (
          <div
            key={index}
            onClick={() => day && onDateClick(day)}
            className={`min-h-17.5 md:min-h-30 border rounded-md p-1 md:p-2 transition-all ${
              day ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-100"
            }`}
          >
            {day && (
              <>
                <div className="text-xs md:text-sm font-semibold text-gray-500 mb-1 md:mb-2">
                  {day}
                </div>
                <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                  {dayPayments.map((payment) => (
                    <button
                      key={payment.id}
                      onClick={() => onSelectPayment(payment)}
                      className={`w-full text-left rounded-md border ${getStatusColor(
                        payment.status,
                      )}`}
                    >
                      <div className="flex items-center gap-1 p-0.5 md:p-1.5">
                        {getStatusIcon(payment.status)}
                        <span className="hidden md:block text-xs font-medium truncate">
                          {payment.loyer_mensuel.toLocaleString()} FCFA
                        </span>
                        {/* Point de couleur sur mobile pour gagner de la place */}
                        <span className="md:hidden text-[10px] font-bold truncate">
                          {Math.round(payment.loyer_mensuel / 1000)}k
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
