"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  PaymentStatus,
  PublicEstate,
  PublicPayment,
} from "@/app/lib/definitions";
import {
  createPayment,
  getAllRentedEstates,
  getPaymentCalendar,
  markPaymentAsLate,
  markPaymentAsPaid,
} from "@/app/lib/actions";
import PaymentStats from "@/app/ui/payments/payment-stats";
import { getStatusColor } from "@/app/lib/utils";
import { CalendarGrid } from "@/app/ui/payments/calendar-grid";
import { CalendarSkeleton } from "@/app/ui/calendar-skeleton";
import toast from "react-hot-toast";
import { CreatePaymentModal } from "@/app/ui/payments/create-payment-modal";

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [payments, setPayments] = useState<PublicPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PublicPayment | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDayForCreate, setSelectedDayForCreate] = useState<
    number | null
  >(null);
  const [rentedEstates, setRentedEstates] = useState<PublicEstate[]>([]);

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

  useEffect(() => {
    async function fetchSelectionData() {
      const result = await getAllRentedEstates();

      if (result.status === "success") setRentedEstates(result.data || []);
    }
    fetchSelectionData();
  }, []);

  const handleDateClick = (day: number) => {
    setIsCreateModalOpen(true);
    setSelectedDayForCreate(day);
  };

  const handleSaveNewPayment = async (formData: any) => {
    const newPaymentDate = new Date(
      currentYear,
      currentMonth - 1,
      selectedDayForCreate!,
    );

    const paymentData = {
      ...formData,
      due_date: newPaymentDate.toISOString(),
    };

    const result = await createPayment({ payment: paymentData });

    if (result.status === "error") {
      toast.error(result.message || "Une erreur est survenue");
      return;
    }

    const newPayment = result.data as PublicPayment;

    setPayments((prev) => [...prev, newPayment]);

    toast.success("Paiement enregistré !");
    setIsCreateModalOpen(false);
  };

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

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    const response = await markPaymentAsPaid({ id: paymentId });
    if (response.status === "error") {
      toast.error(response.message || "Une erreur est survenue");
    }
    setSelectedPayment(null);
    window.location.reload();
  };

  const handleMarkAslate = async (paymentId: string) => {
    const response = await markPaymentAsLate({ id: paymentId });
    if (response.status === "error") {
      toast.error(response.message || "Une erreur est survenue");
    }
    setSelectedPayment(null);
    window.location.reload();
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
      total: 0,
      paid: 0,
      pending: 0,
      late: 0,
      totalAmount: 0,
    };

    return payments.reduce((acc, p) => {
      acc.total += 1;
      acc.totalAmount += p.loyer_mensuel;
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
            <span className="md:hidden text-[10px] font-medium bg-gray-100 text-primary px-2 py-0.5 rounded-full w-fit">
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
            <CalendarGrid
              days={calendarDays}
              paymentsByDay={paymentsByDay}
              onSelectPayment={setSelectedPayment}
              onDateClick={handleDateClick}
            />
          )}
        </div>
      </div>

      {isCreateModalOpen && selectedDayForCreate && (
        <CreatePaymentModal
          day={selectedDayForCreate}
          month={currentMonth}
          year={currentYear}
          estates={rentedEstates}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNewPayment}
        />
      )}

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-md max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Détails du paiement
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}
              >
                {getStatusIcon(selectedPayment.status)}
                {selectedPayment.status === PaymentStatus.paid && "Payé"}
                {selectedPayment.status === PaymentStatus.pending &&
                  "En attente"}
                {selectedPayment.status === PaymentStatus.late && "En retard"}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {/* Informations sur le Bien */}
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bien Immobilier
                </span>
                <p className="font-bold text-gray-900 mt-1">
                  {selectedPayment.estate.titre}
                </p>
                <p className="text-sm text-gray-600 italic">
                  {selectedPayment.estate.adresse}
                </p>
              </div>

              {/* Informations sur le Locataire */}
              <div className="flex justify-between items-center px-1">
                <div>
                  <span className="text-xs text-gray-500 block">Locataire</span>
                  <p className="font-medium text-gray-800">
                    {selectedPayment.locataire}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Montant</span>
                  <p className="text-lg font-bold text-primary">
                    {selectedPayment.loyer_mensuel.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-xs text-gray-500 block">
                  Date d'échéance
                </span>
                <p className="font-medium text-gray-900">
                  {new Date(selectedPayment.due_date).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {selectedPayment.status !== PaymentStatus.paid && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkAsPaid(selectedPayment.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Confirmer le paiement
                  </button>

                  {selectedPayment.status !== PaymentStatus.late && (
                    <button
                      onClick={() => handleMarkAslate(selectedPayment.id)}
                      className="flex-1 bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-md hover:bg-red-100 transition-colors font-medium"
                    >
                      Signaler retard
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
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
