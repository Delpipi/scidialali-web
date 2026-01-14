"use client";

import { useState } from "react";

import { PublicRentalRequest } from "@/app/lib/definitions";
import {
  MapPin,
  Home,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DoorOpen,
  Ruler,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { formatCurrency, formatRelativeDate } from "@/app/lib/utils";
import RentalRequestStatus from "@/app/ui/rental_requests/rental-request-status";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import { approveRentalRequest, rejectedRentalRequest } from "@/app/lib/actions";

// Composant Modal
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-sm shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function RequestDetailPage({
  request,
}: {
  request: PublicRentalRequest;
}) {
  const router = useRouter();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const message = await approveRentalRequest(request.id, adminNotes);
      toast.success(message as string);
      setIsApproveModalOpen(false);
      setTimeout(() => {
        router.push("/admin/demandes");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast.error("Une erreur est survenue lors de l'approbation", {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const message = await rejectedRentalRequest(request.id);
      toast.success(message as string, {
        duration: 4000,
        icon: "❌",
      });
      setIsRejectModalOpen(false);
      setTimeout(() => {
        router.push("/admin/demandes");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      toast.error("Une erreur est survenue lors du refus", {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = formatRelativeDate(request.created_at);
  return (
    <>
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approuver la demande"
      >
        <div className="p-6 space-y-4">
          <p className="text-slate-600">
            Voulez-vous approuver la demande de{" "}
            <span className="font-semibold text-slate-800">
              {request.user?.prenom} {request.user?.nom}
            </span>{" "}
            pour le bien{" "}
            <span className="font-semibold text-slate-800">
              {request.estate?.titre}
            </span>{" "}
            ?
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes administratives (optionnel)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ajoutez des remarques ou conditions..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg  outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsApproveModalOpen(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg cursor-pointer hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white cursor-pointer font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Approuver
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de refus */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Refuser la demande"
      >
        <div className="p-6 space-y-4">
          <p className="text-slate-600">
            Êtes-vous sûr de vouloir refuser la demande de{" "}
            <span className="font-semibold text-slate-800">
              {request.user?.prenom} {request.user?.nom}
            </span>{" "}
            ?
          </p>
          <p className="text-sm text-slate-500">
            Cette action est irréversible.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsRejectModalOpen(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  Refuser
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <main className="min-h-screen  p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Breadcrumbs
              breadcrumbs={[
                { label: "Demandes", href: "/admin/rental_requests" },
                {
                  label: "Détail de la demande",
                  href: `/admin/rental_requests/${request.id}`,
                  active: true,
                },
              ]}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Demande</h1>
              {formattedDate && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Reçue {formattedDate}</span>
                </div>
              )}
            </div>

            <RentalRequestStatus status={request.status} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-600" />
                    Informations du locataire
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {request.user?.prenom?.[0]?.toUpperCase()}
                      {request.user?.nom?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {request.user?.prenom} {request.user?.nom}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize">
                        {request.user?.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">
                          Email
                        </p>
                        <p className="text-sm text-slate-700">
                          {request.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">
                          Contact
                        </p>
                        <p className="text-sm text-slate-700">
                          {request.user?.contact}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2">
                      <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">
                          Profession
                        </p>
                        <p className="text-sm text-slate-700">
                          {request.user?.profession}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message du locataire */}
              {request.message && (
                <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      Message du locataire
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 leading-relaxed">
                      {request.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Documents du locataire */}
              {request.user?.documents && request.user.documents.length > 0 && (
                <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      Documents du locataire
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {request.user.documents.map((doc, index) => {
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc);

                        return isImage ? (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group"
                          >
                            <Image
                              src={doc}
                              alt={`Document ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </a>
                        ) : (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 truncate">
                                Document {index + 1}
                              </p>
                              <p className="text-xs text-slate-500">PDF</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes admin */}
              {request.admin_notes && (
                <div className="bg-amber-50 rounded-sm  border border-amber-200 overflow-hidden">
                  <div className="px-6 py-4 bg-amber-100 border-b border-amber-200">
                    <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-700" />
                      Notes administratives
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-amber-900 leading-relaxed">
                      {request.admin_notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Galerie d'images */}
              {request.estate?.images && request.estate.images.length > 0 && (
                <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                      Photos du bien
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {request.estate.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden bg-slate-100"
                        >
                          <Image
                            src={image}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Informations sur le bien */}
              <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Home className="w-5 h-5 text-slate-600" />
                    Le bien
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-2">
                      {request.estate?.titre}
                    </h3>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 mt-1 shrink-0" />
                      <p className="text-sm">{request.estate?.adresse}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Type</span>
                      <span className="text-sm font-medium text-slate-800 capitalize">
                        {request.estate?.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DoorOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Chambres</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {request.estate?.rooms}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Surface</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {request.estate?.area} m²
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-sm text-slate-600">
                        Loyer mensuel
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(request.estate?.loyer_mensuel || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {request.status === 0 && (
                <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Actions
                    </h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <button
                      onClick={() => setIsApproveModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      Approuver
                    </button>
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Refuser
                    </button>
                  </div>
                </div>
              )}

              {/* Documents */}
              {request.estate?.documents &&
                request.estate.documents.length > 0 && (
                  <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-600" />
                        Documents
                      </h2>
                    </div>
                    <div className="p-6 space-y-2">
                      {request.estate.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 truncate">
                              Document {index + 1}
                            </p>
                            <p className="text-xs text-slate-500">PDF</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
