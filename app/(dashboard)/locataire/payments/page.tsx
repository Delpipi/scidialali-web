"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Wallet,
  X,
} from "lucide-react";
import { PaymentStatus, PublicPayment } from "@/app/lib/definitions";
import { getPaymentCalendar } from "@/app/lib/actions";
import PaymentStats from "@/app/ui/payments/payment-stats";
import { CalendarSkeleton } from "@/app/ui/calendar-skeleton";
import { LocataireCalendarGrid } from "@/app/ui/payments/locataire/locataire-calendar-grid";
import { getStatusColor } from "@/app/lib/utils";

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [payments, setPayments] = useState<PublicPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PublicPayment | null>(
    null,
  );

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPaymentCalendar({
        year: currentYear,
        month: currentMonth,
      });
      setPayments(data.response || []);
      setLoading(false);
    }
    load();
  }, [currentMonth, currentYear]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.paid:
        return {
          text: "text-green-600",
          bg: "bg-green-50",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          label: "Payé",
        };
      case PaymentStatus.late:
        return {
          text: "text-red-600",
          bg: "bg-red-50",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          label: "En retard",
        };
      default:
        return {
          text: "text-yellow-600",
          bg: "bg-yellow-50",
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          label: "En attente",
        };
    }
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const calendarDays = useMemo(() => {
    const days = [];
    const total = new Date(currentYear, currentMonth, 0).getDate();
    const first = new Date(currentYear, currentMonth - 1, 1).getDay();
    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= total; d++) days.push(d);
    return days;
  }, [currentYear, currentMonth]);

  const paymentsByDay = useMemo(() => {
    const map: { [key: number]: PublicPayment[] } = {};

    payments.forEach((payment) => {
      const day = new Date(payment.due_date).getDate();
      if (!map[day]) map[day] = [];
      map[day].push(payment);
    });

    return map;
  }, [payments]);

  const stats = useMemo(() => {
    const initialStats = {
      paid: 0,
      pending: 0,
      late: 0,
    };

    return payments.reduce((acc, p) => {
      if (p.status === PaymentStatus.paid) acc.paid += 1;
      if (p.status === PaymentStatus.pending) acc.pending += 1;
      if (p.status === PaymentStatus.late) acc.late += 1;
      return acc;
    }, initialStats);
  }, [payments]);

  return (
    <div className="min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calendrier des Paiements
        </h1>
        <p className="text-gray-600">
          Gérez et suivez tous les paiements de loyer
        </p>
      </div>

      <PaymentStats stats={stats} />

      {/* Calendrier */}
      <div className="bg-white rounded-md shadow">
        {/* Navigation du mois */}
        <div className="flex items-center justify-between p-3 md:p-6 border-b bg-white rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
              {monthNames[currentMonth - 1]}{" "}
              <span className="text-primary">{currentYear}</span>
            </h2>
            <span className="md:hidden text-[10px] font-medium bg-gray-100 text-primary px-2 py-0.5 rounded-md w-fit">
              {payments.length} paiements
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent active:border-gray-200"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>

            {/* Bouton "Aujourd'hui" visible uniquement sur desktop pour gagner de la place */}
            <button
              onClick={() => setCurrentDate(new Date())}
              className="hidden md:block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent active:border-gray-200"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-2 md:p-6 overflow-hidden">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <CalendarSkeleton />
          ) : (
            <LocataireCalendarGrid
              days={calendarDays}
              paymentsByDay={paymentsByDay}
              onSelectPayment={setSelectedPayment}
            />
          )}
        </div>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-md max-w-md w-full p-6 shadow-2xl">
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span className="font-bold">Détails de l'échéance</span>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Montant à régler
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {selectedPayment.loyer_mensuel.toLocaleString()}{" "}
                  <span className="text-base">FCFA</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-500">Date limite</span>
                  <span className="text-sm font-bold text-gray-800">
                    {new Date(selectedPayment.due_date).toLocaleDateString(
                      "fr-FR",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-3 rounded-md border ${getStatusColor(selectedPayment.status)}`}
                >
                  <span>Statut</span>
                  <div
                    className={`flex items-center gap-1.5 font-bold text-xs`}
                  >
                    {getStatusStyle(selectedPayment.status).icon}
                    {getStatusStyle(selectedPayment.status).label}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full mt-6 py-3 bg-gray-200  rounded-md font-bold hover:bg-gray-300 transition-all active:scale-95"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
