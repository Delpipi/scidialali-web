"use client";

import { useState, useEffect } from "react";
import {
  Reply,
  Download,
  X,
  Paperclip,
  AlertCircle,
  CreditCard,
  FileText,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";
import { PublicMessage } from "@/app/lib/definitions";
import { replyToMessage, getMessageReplies } from "@/app/lib/actions";

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
  const [replies, setReplies] = useState<PublicMessage[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const typeConfig =
    MESSAGE_TYPE_CONFIG[message.type as keyof typeof MESSAGE_TYPE_CONFIG] ||
    MESSAGE_TYPE_CONFIG.general;
  const Icon = typeConfig.icon;

  useEffect(() => {
    if (message.id) loadReplies(message.id);
  }, [message.id]);

  const loadReplies = async (id: string) => {
    setLoadingReplies(true);
    try {
      const result = await getMessageReplies(id);
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
    if (
      !replyContent.trim() ||
      replyContent.length < 10 ||
      replyContent.length > 1000
    ) {
      setError("Le message doit faire entre 10 et 1000 caractères");
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
        await loadReplies(message.id);
        onReplySuccess();
      } else {
        setError(result.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      setError(`Erreur lors de l'envoi de la réponse, ${error}`);
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.some((f) => f.size > 10 * 1024 * 1024)) {
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
      {/* Header optimisé Mobile */}
      <div className="border-b p-3 md:p-4 bg-gray-50 flex items-center gap-3">
        <button
          onClick={onClose}
          className="md:hidden p-1 hover:bg-gray-200 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-wide ${typeConfig.color}`}
            >
              <Icon className="w-4 h-4" />
              {typeConfig.label}
            </span>
          </div>
          <h2 className="text-sm md:text-xl font-bold text-gray-900 truncate">
            {message.subject}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="hidden md:block p-2 hover:bg-gray-200 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Zone de contenu scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        {/* Message Principal */}
        <div className="p-4 md:p-6 border-b bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">
              {message.sender?.prenom?.[0].toUpperCase()}
            </div>
            <div className="text-xs">
              <p className="font-bold text-gray-900">
                {message.sender?.nom} {message.sender?.prenom}
              </p>
              <p className="text-gray-500">
                {new Date(message.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
            {message.content}
          </p>

          {message.attachments?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {message.attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition group"
                >
                  <div className="shrink-0 w-8 h-8 bg-white border rounded flex items-center justify-center text-[10px] font-bold text-primary">
                    DOC
                  </div>
                  <span className="flex-1 text-xs font-medium truncate text-gray-700">
                    {url.split("/").pop()}
                  </span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Section Réponses */}
        <div className="p-4 space-y-4">
          {loadingReplies ? (
            <div className="text-center py-4 text-xs text-gray-400 animate-pulse">
              Chargement des échanges...
            </div>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="flex flex-col space-y-1">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                    {reply.sender?.prenom} {reply.sender?.nom}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-200  max-w-[90%]">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Zone de réponse compacte */}
      <div className="p-3 md:p-4 border-t bg-white sticky bottom-0">
        {!showReply ? (
          <button
            onClick={() => setShowReply(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <Reply className="w-5 h-5" />
            Répondre
          </button>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="p-2 bg-red-50 text-red-600 text-[10px] rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}

            <textarea
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
                setError("");
              }}
              placeholder="Écrivez votre réponse ici..."
              className="w-full p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border-transparent resize-none"
              rows={4}
            />

            <div className="flex items-center justify-between">
              <label
                htmlFor="mobile-reply-files"
                className="flex items-center gap-2 p-2 text-primary font-bold text-xs cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                Joindre
                <input
                  type="file"
                  id="mobile-reply-files"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="text-[10px] text-gray-400">
                {replyContent.length}/1000
              </span>
            </div>

            {replyFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {replyFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-gray-50 border px-2 py-1 rounded-md text-[10px]"
                  >
                    <span className="truncate max-w-20">{file.name}</span>
                    <X
                      className="w-3 h-3 text-red-500"
                      onClick={() => removeFile(i)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleReply}
                disabled={sending || !replyContent.trim()}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
              <button
                onClick={() => {
                  setShowReply(false);
                  setReplyContent("");
                  setReplyFiles([]);
                }}
                className="px-4 py-3 border rounded-xl font-bold text-gray-500"
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
