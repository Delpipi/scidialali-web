import { PaymentStatus, PublicPayment } from "@/app/lib/definitions";
import { getStatusColor } from "@/app/lib/utils";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface CalendarGridProps {
  days: (number | null)[];
  paymentsByDay: { [key: number]: PublicPayment[] };
  onSelectPayment: (payment: PublicPayment) => void;
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

export function LocataireCalendarGrid({
  days,
  paymentsByDay,
  onSelectPayment,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-1 md:gap-2">
      {days.map((day, index) => {
        const dayPayments = day ? paymentsByDay[day] || [] : [];
        const hasPayment = dayPayments.length > 0;

        const mainStatus = hasPayment ? dayPayments[0].status : null;

        const isToday =
          day === new Date().getDate() &&
          new Date().getMonth() === new Date().getMonth();

        return (
          <div
            key={index}
            onClick={() => onSelectPayment(dayPayments[0])}
            className={`min-h-17.5 md:min-h-27.5 border rounded-md p-1.5 md:p-3 transition-all relative ${
              day
                ? hasPayment
                  ? `${getStatusColor(mainStatus!)} cursor-pointer shadow-sm`
                  : "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"
                : "bg-gray-50/50 border-gray-100"
            } ${day && isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
          >
            {day && (
              <>
                <div
                  className={`text-xs md:text-sm font-black mb-1 md:mb-2 ${hasPayment ? "text-primary" : "text-gray-400"}`}
                >
                  {day}
                </div>

                <div className="space-y-1">
                  {dayPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`flex items-center gap-1 p-1 md:p-1.5 rounded-lg border text-[10px] md:text-xs font-bold transition-transform active:scale-95 ${getStatusColor(payment.status)}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="truncate">
                        {payment.loyer_mensuel.toLocaleString()}
                        <span className="hidden md:inline ml-0.5 font-normal">
                          FCFA
                        </span>
                      </span>
                    </div>
                  ))}

                  {/* Petit trait visuel bleu discret sous le jour pour mobile */}
                  {hasPayment && (
                    <div className="md:hidden w-full h-1 bg-primary rounded-full mt-1" />
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
