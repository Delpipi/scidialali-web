import { useState, useEffect } from "react";
import {
  Mail,
  MailOpen,
  Paperclip,
  Trash2,
  AlertCircle,
  CreditCard,
  FileText,
  MessageSquare,
} from "lucide-react";
import { PublicMessage } from "@/app/lib/definitions";
import { deleteMessage, getAllMessages, getInbox } from "@/app/lib/actions";

interface MessageListProps {
  onSelectMessage: (message: PublicMessage) => void;
  selectedMessageId?: string;
  showDelete?: boolean;
}

const MESSAGE_TYPE_CONFIG = {
  incident: {
    label: "Incident",
    icon: AlertCircle,
    color: "text-red-600 bg-red-50",
  },
  payment_reminder: {
    label: "Rappel paiement",
    icon: CreditCard,
    color: "text-orange-600 bg-orange-50",
  },
  document_request: {
    label: "Demande document",
    icon: FileText,
    color: "text-primary bg-blue-50",
  },
  general: {
    label: "Général",
    icon: MessageSquare,
    color: "text-gray-600 bg-gray-50",
  },
};

export function MessageList({
  onSelectMessage,
  selectedMessageId,
  showDelete,
}: MessageListProps) {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMessages();
  }, [page]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const result = await getAllMessages({ order_by: "created_at" });
      setMessages(result.data?.items || []);
      setTotalPages(
        result.data?.total_count ? Math.ceil(result.data.total_count / 20) : 1,
      );
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce message et ses pièces jointes ?")) return;

    try {
      await deleteMessage(id);
      loadMessages();
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aucun message</p>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => {
              const typeConfig = MESSAGE_TYPE_CONFIG[message.type];
              const Icon = typeConfig.icon;

              return (
                <div
                  key={message.id}
                  onClick={() => onSelectMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-primary/4 transition ${
                    selectedMessageId === message.id
                      ? "bg-primary/4 border-l-4 border-primary"
                      : ""
                  } ${!message.is_read ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {message.is_read ? (
                        <MailOpen className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Type badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${typeConfig.color}`}
                          >
                            <Icon className="w-3 h-3" />
                            {typeConfig.label}
                          </span>
                        </div>

                        {/* Subject */}
                        <p
                          className={`font-medium truncate ${
                            !message.is_read ? "text-primary" : "text-gray-900"
                          }`}
                        >
                          {message.subject}
                        </p>

                        {/* Sender/Recipient */}
                        <p className="text-xs text-gray-600 mt-0.5">
                          {message.sender
                            ? `De: ${message.sender.nom} ${message.sender.prenom}`
                            : ""}
                        </p>

                        {/* Content preview */}
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {message.content}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                          {message.attachments?.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Paperclip className="w-3 h-3" />
                              <span>{message.attachments.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {showDelete && (
                      <button
                        onClick={(e) => handleDelete(message.id, e)}
                        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t p-4 flex justify-center gap-2 bg-white">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="px-3 py-1 text-sm">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
