import { useState, useEffect } from "react";
import {
  Reply,
  Download,
  X,
  User,
  Paperclip,
  AlertCircle,
  CreditCard,
  FileText,
  MessageSquare,
} from "lucide-react";
import { PublicMessage } from "@/app/lib/definitions";
import { replyToMessage, getMessageReplies } from "@/app/lib/actions";
import { LinkButton } from "../button";

interface MessageDetailProps {
  message: PublicMessage;
  onClose: () => void;
  onReplySuccess: () => void;
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

export function MessageDetail({
  message,
  onClose,
  onReplySuccess,
}: MessageDetailProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // ✅ NOUVEAU: État pour les réponses
  const [replies, setReplies] = useState<PublicMessage[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const typeConfig = MESSAGE_TYPE_CONFIG[message.type];
  const Icon = typeConfig.icon;

  // ✅ NOUVEAU: Charger les réponses au montage du composant
  useEffect(() => {
    if (message.parent_id) {
      loadReplies(message.parent_id);
    }
  }, [message.parent_id]);

  const loadReplies = async (parent_id: string) => {
    setLoadingReplies(true);
    try {
      const result = await getMessageReplies(parent_id);
      if (result.status === "success" && result.data) {
        setReplies(result.data.items);
      }
    } catch (error) {
      console.error("Erreur chargement réponses:", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      setError("Le message ne peut pas être vide");
      return;
    }

    if (replyContent.length < 10) {
      setError("Le message doit contenir au moins 10 caractères");
      return;
    }

    if (replyContent.length > 1000) {
      setError("Le message doit contenir au plus 1000 caractères");
      return;
    }

    try {
      setSending(true);
      setError("");
      const result = await replyToMessage(message.id, replyContent, replyFiles);

      if (result.status === "success") {
        setReplyContent("");
        setReplyFiles([]);
        setShowReply(false);

        // ✅ Recharger les réponses après avoir envoyé
        if (message.parent_id) {
          await loadReplies(message.parent_id);
        }

        onReplySuccess();
        alert("Réponse envoyée avec succès");
      } else {
        setError(result.message || "Erreur lors de l'envoi");
      }
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'envoi de la réponse");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const oversized = files.filter((f) => f.size > 10 * 1024 * 1024);
      if (oversized.length > 0) {
        setError("Certains fichiers dépassent 10 MB");
        return;
      }

      setReplyFiles(files);
      setError("");
    }
  };

  const removeFile = (index: number) => {
    setReplyFiles((files) => files.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b p-4 bg-gray-50">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${typeConfig.color}`}
            >
              <Icon className="w-4 h-4" />
              {typeConfig.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          {message.subject}
        </h2>

        {message.sender && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="font-medium">
              {message.sender.nom} {message.sender.prenom}
            </span>
            <span className="text-gray-400">•</span>
            <span>{message.sender.email}</span>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-2">
          {new Date(message.created_at).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Content avec scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* Message principal */}
        <div className="p-6 border-b bg-white">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* attachments au lieu de documents */}
          {message.attachments?.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Pièces jointes ({message.attachments.length})
              </h3>
              <div className="space-y-2">
                {message.attachments.map((url, index) => {
                  const filename =
                    url.split("/").pop() || `document-${index + 1}`;
                  const extension =
                    filename.split(".").pop()?.toUpperCase() || "FILE";

                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition group"
                    >
                      <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {extension}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cliquer pour télécharger
                        </p>
                      </div>
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-primary shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ✅ NOUVEAU: Section des réponses */}
        {loadingReplies ? (
          <div className="p-6 text-center text-gray-500">
            <p>Chargement des réponses...</p>
          </div>
        ) : replies.length > 0 ? (
          <div className="bg-gray-50">
            <div className="p-4 border-b bg-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Reply className="w-4 h-4" />
                {replies.length} réponse{replies.length > 1 ? "s" : ""}
              </h3>
            </div>

            {replies.map((reply, index) => (
              <div
                key={reply.id}
                className={`p-6 border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
                {/* Info expéditeur */}
                {reply.sender && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <div className="w-10 h-10 rounded-md-full flex items-center justify-center text-white font-semibold text-sm shadow-md bg-primary">
                      {reply.sender.prenom?.[0]?.toUpperCase() || "?"}
                      {reply.sender.nom?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {reply.sender.nom} {reply.sender.prenom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(reply.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contenu de la réponse */}
                <div className="ml-10">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {reply.content}
                  </p>

                  {/* Pièces jointes de la réponse */}
                  {reply.attachments?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {reply.attachments.map((url, idx) => {
                        const filename = url.split("/").pop() || `file-${idx}`;
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-xs">
                              {filename}
                            </span>
                            <Download className="w-3 h-3" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400 text-sm bg-gray-50">
            Aucune réponse pour le moment
          </div>
        )}
      </div>

      {/* Reply Section */}
      <div className="border-t p-4 bg-white">
        {!showReply ? (
          <LinkButton onClick={() => setShowReply(true)}>
            <Reply className="w-4 h-4" />
            Répondre
          </LinkButton>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <textarea
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
                setError("");
              }}
              placeholder="Votre réponse (10-1000 caractères)..."
              className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
              rows={5}
            />

            <div className="text-xs text-gray-500">
              {replyContent.length} / 1000 caractères
            </div>

            {/* File Upload */}
            <div>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="reply-files"
              />
              <label
                htmlFor="reply-files"
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition"
              >
                <Paperclip className="w-4 h-4" />
                Joindre des fichiers
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Maximum 10 MB par fichier. Formats: JPG, PNG, PDF, DOC, DOCX
              </p>

              {replyFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {replyFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 border rounded-md"
                    >
                      <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReply}
                disabled={sending || !replyContent.trim()}
                className="px-4 py-2 rounded-md bg-primary text-white"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
              <button
                onClick={() => {
                  setShowReply(false);
                  setReplyContent("");
                  setReplyFiles([]);
                  setError("");
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
