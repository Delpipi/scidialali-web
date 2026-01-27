import { useState, useEffect } from "react";
import { X, Paperclip } from "lucide-react";
import { MessageType } from "@/app/lib/definitions";
import { createMessage, getAllUsers } from "@/app/lib/actions";

interface NewMessageProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultRecipientId?: string;
  showRecipientSelect?: boolean;
}

export function NewMessage({
  onClose,
  onSuccess,
  defaultRecipientId,
  showRecipientSelect = true,
}: NewMessageProps) {
  const [formData, setFormData] = useState({
    recipient_id: defaultRecipientId || "",
    subject: "",
    content: "",
    type: MessageType.GENERAL,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showRecipientSelect && !defaultRecipientId) {
      loadUsers();
    }
  }, [showRecipientSelect, defaultRecipientId]);

  const loadUsers = async () => {
    try {
      const result = await getAllUsers({
        order_by: "created_at",
        currentPage: 1,
      });
      setUsers(result.data.items || []);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.recipient_id) {
      setError("Veuillez sélectionner un destinataire");
      return;
    }

    if (formData.subject.length < 5 || formData.subject.length > 50) {
      setError("L'objet doit contenir entre 5 et 50 caractères");
      return;
    }

    if (formData.content.length < 10 || formData.content.length > 1000) {
      setError("Le message doit contenir entre 10 et 1000 caractères");
      return;
    }

    try {
      setSending(true);
      await createMessage({ ...formData, files });
      alert("Message envoyé avec succès");
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Vérifier taille max 10MB par fichier
      const oversized = newFiles.filter((f) => f.size > 10 * 1024 * 1024);
      if (oversized.length > 0) {
        setError("Certains fichiers dépassent 10 MB");
        return;
      }

      // Max 20 fichiers
      if (files.length + newFiles.length > 20) {
        setError("Maximum 20 fichiers par message");
        return;
      }

      setFiles([...files, ...newFiles]);
      setError("");
    }
  };

  const removeFile = (index: number) => {
    setFiles((files) => files.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Nouveau message
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Recipient */}
          {showRecipientSelect && !defaultRecipientId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destinataire *
              </label>
              <select
                value={formData.recipient_id}
                onChange={(e) =>
                  setFormData({ ...formData, recipient_id: e.target.value })
                }
                className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.nom} {user.prenom} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de message
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as MessageType,
                })
              }
              className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            >
              <option value={MessageType.GENERAL}>Général</option>
              <option value={MessageType.INCIDENT}>Incident</option>
              <option value={MessageType.PAYMENT_REMINDER}>
                Rappel de paiement
              </option>
              <option value={MessageType.DOCUMENT_REQUEST}>
                Demande de document
              </option>
            </select>
          </div>
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objet *{" "}
              <span className="text-xs text-gray-500">(5-50 caractères)</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
              required
              minLength={5}
              maxLength={50}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.subject.length} / 50
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *{" "}
              <span className="text-xs text-gray-500">
                (10-1000 caractères)
              </span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
              rows={6}
              required
              minLength={10}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.content.length} / 1000
            </div>
          </div>

          {/* File Upload */}
          <div>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="message-files"
            />
            <label
              htmlFor="message-files"
              className="inline-flex items-center gap-2 px-xsmall py-xsmall border-2 bg-gray-100 outline-gray-600 rounded cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              Joindre des fichiers
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Maximum 20 fichiers, 10 MB par fichier. Formats: JPG, PNG, PDF,
              DOC, DOCX
            </p>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 border rounded"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 shrink-0">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
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

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-primary text-white rounded  disabled:cursor-not-allowed transition"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
