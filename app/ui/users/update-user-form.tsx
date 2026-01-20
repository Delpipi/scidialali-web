"use client";

import { useRouter } from "next/navigation";
import {
  deleteDocument,
  updatePassword,
  updateUser,
  uploadDocument,
} from "@/app/lib/actions";

import { Estate, PublicUser, UpdateUser, User } from "@/app/lib/definitions";
import {
  Upload,
  X,
  FileText,
  Loader,
  Lock,
  Eye,
  EyeOff,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  LockIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Errors = {
  nom?: string[];
  prenom?: string[];
  password?: string[];
  email?: string[];
  contact?: string[];
  profession?: string[];
  revenu?: string[];
};

export default function UpdateUserForm({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [documents, setDocuments] = useState<string[]>(user.documents || []);

  const [fieldErrors, setFieldErrors] = useState<Errors>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // États pour le mot de passe
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
  };

  const uploadFiles = async (fileArray: File[]) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Validation des fichiers
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      for (const file of fileArray) {
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Type de fichier non autorisé: ${file.name}`);
          setIsUploading(false);
          return;
        }
        if (file.size > maxSize) {
          toast.error(`Fichier trop volumineux: ${file.name} (max 10MB)`);
          setIsUploading(false);
          return;
        }
      }

      const resUpload = await uploadDocument(
        user.id,
        fileArray,
        "user_documents"
      );

      if (resUpload.status === "error") {
        toast.error(resUpload.message);
        return;
      }

      const newDocs = resUpload.data?.urls || [];
      setDocuments([...documents, ...newDocs]);
      toast.success(resUpload.message);
      setUploadProgress(100);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Erreur lors de l'upload des fichiers");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files));
    }
    e.target.value = "";
  };

  const handleDeleteDocument = async (docUrl: string) => {
    try {
      // Appel direct à l'API FastAPI
      const response = await deleteDocument(
        user.id,
        [docUrl],
        "user_documents"
      );

      if (response.status === "error") {
        toast.error(response.message);
        return;
      }

      setDocuments(documents.filter((d) => d !== docUrl));
      toast.success(response.message);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      // Validation
      if (!oldPassword || !newPassword || !confirmPassword) {
        toast.error("Tous les champs du mot de passe sont requis");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      if (newPassword.length != 4) {
        toast.error("Le mot de passe doit etre de 4 chiffres.");
        return;
      }

      setIsUpdatingPassword(true);

      const response = await updatePassword(oldPassword, newPassword);

      if (response.status === "error") {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      toast.error("Erreur lors de la modification du mot de passe");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      formData.append("id", user.id);
      formData.append("documents", JSON.stringify(documents));

      const result = await updateUser(formData);
      if (result.fieldErrors && Object.entries(result.fieldErrors).length > 0) {
        setFieldErrors(result.fieldErrors);
      }

      if (result.status === "success") {
        toast.success(result.message);
        if (user.role === "admin") {
          setTimeout(() => router.push("/admin/users"), 2000);
        }
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  const getFileName = (url: string) => url.split("/").pop() || url;
  const getFileExtension = (url: string) =>
    getFileName(url).split(".").pop()?.toUpperCase() || "FILE";

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-4 md:p-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Utilisateur</h1>
        <p className="text-gray-600">
          {user.prenom} {user.nom}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ligne 1: Informations Personnelles + Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-slate-600" />
                Informations Personnelles
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "nom", label: "Nom", type: "text", icon: UserIcon },
                  {
                    id: "prenom",
                    label: "Prénom",
                    type: "text",
                    icon: UserIcon,
                  },
                  {
                    id: "email",
                    label: "Email",
                    type: "email",
                    icon: MailIcon,
                  },
                  {
                    id: "contact",
                    label: "Contact",
                    type: "tel",
                    icon: PhoneIcon,
                  },
                  {
                    id: "profession",
                    label: "Profession",
                    type: "text",
                    icon: BriefcaseIcon,
                  },
                ].map((field) => {
                  const Icon = field.icon;
                  const fieldsErrors =
                    fieldErrors?.[field.id as keyof Errors] || [];
                  return (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="mb-2 block text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          placeholder={field.label}
                          disabled={isLoading || isUploading}
                          aria-describedby={`${field.id}-error`}
                          defaultValue={String(
                            user[field.id as keyof User] ?? ""
                          )}
                          required
                          className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                        />
                        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                      </div>
                      <div id="nom-error" aria-live="polite" aria-atomic="true">
                        {fieldsErrors.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {user.role === "admin" && (
                  <>
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Rôle
                      </label>
                      <select
                        id="role"
                        name="role"
                        defaultValue={user.role}
                        required
                        disabled={isLoading || isUploading}
                        className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                      >
                        <option value="admin">admin</option>
                        <option value="locataire">Locataire</option>
                        <option value="prospect">Prospect</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          id="is_active"
                          name="is_active"
                          defaultChecked={!user.is_active}
                          disabled={isLoading || isUploading}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                        />
                        <span>Désactiver cet utilisateur</span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Gestion des Documents */}
          <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Documents
              </h2>
            </div>
            <div className="p-6">
              {/* Zone de drag & drop */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-sm border-2 border-dashed transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <div className="p-8 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileInputChange}
                    disabled={isLoading || isUploading}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex justify-center mb-3">
                      {isUploading ? (
                        <Loader className="h-10 w-10 text-blue-600 animate-spin" />
                      ) : (
                        <Upload className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {isUploading
                        ? "Téléversement en cours..."
                        : "Glissez vos fichiers ici ou cliquez pour sélectionner"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                    </p>
                  </label>
                </div>

                {/* Barre de progression */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Liste des documents */}
              {documents.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Documents attachés ({documents.length})
                  </h3>
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    {documents.map((docUrl, index) => (
                      <div
                        key={docUrl}
                        className="flex items-center justify-between rounded-sm border border-gray-200 bg-background p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="shrink-0 h-10 w-10 rounded-sm bg-blue-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary/40 hover:text-primary/60 hover:underline truncate block"
                              title={getFileName(docUrl)}
                            >
                              {getFileName(docUrl)}
                            </a>
                            <p className="text-xs text-gray-500">
                              {getFileExtension(docUrl)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(docUrl)}
                          disabled={isLoading || isUploading}
                          className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Supprimer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {documents.length === 0 && (
                <div className="mt-6 text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Aucun document attaché
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ligne 2: Bien Associé + Mot de Passe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <LockIcon className="w-5 h-5 text-slate-600" />
                Modifier le Mot de Passe
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Ancien mot de passe */}
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ancien mot de passe
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        disabled={
                          isLoading || isUploading || isUpdatingPassword
                        }
                        className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                        placeholder="••••"
                      />
                      <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={
                          isLoading || isUploading || isUpdatingPassword
                        }
                        className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                        placeholder="••••"
                      />
                      <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={
                          isLoading || isUploading || isUpdatingPassword
                        }
                        className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                        placeholder="••••"
                      />
                      <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bouton modifier mot de passe */}
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  disabled={
                    isLoading ||
                    isUploading ||
                    isUpdatingPassword ||
                    !oldPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Modifier le mot de passe
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading || isUploading || isUpdatingPassword}
            className="bg-primary text-white py-xsmall cursor-pointer w-full flex justify-center items-center rounded-md"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
