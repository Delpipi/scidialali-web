"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteDocument,
  updateEstate,
  uploadDocument,
} from "@/app/lib/actions";
import Link from "next/link";
import { PublicEstate, PublicUser } from "@/app/lib/definitions";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Loader,
  Image as ImageIcon,
  Building2Icon,
  FileIcon,
} from "lucide-react";
import toast from "react-hot-toast";

interface UpdateEstateFormProps {
  estate: PublicEstate;
  gestionnaires: PublicUser[];
}

export default function UpdateEstateForm({
  estate,
  gestionnaires,
}: UpdateEstateFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [images, setImages] = useState<string[]>(estate.images || []);
  const [documents, setDocuments] = useState<string[]>(estate.documents || []);
  const [selectedGestionnaire, setSelectedGestionnaire] = useState<string>(
    estate.id_gestionnaire || ""
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActiveImages, setDragActiveImages] = useState(false);
  const [dragActiveDocs, setDragActiveDocs] = useState(false);

  // ========== GESTION DRAG & DROP IMAGES ==========
  const handleDragImages = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveImages(true);
    } else if (e.type === "dragleave") {
      setDragActiveImages(false);
    }
  };

  const handleDropImages = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveImages(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files), "estate_images");
    }
  };

  // ========== GESTION DRAG & DROP DOCUMENTS ==========
  const handleDragDocs = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveDocs(true);
    } else if (e.type === "dragleave") {
      setDragActiveDocs(false);
    }
  };

  const handleDropDocs = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDocs(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files), "estate_documents");
    }
  };

  // ========== UPLOAD UNIVERSEL ==========
  const uploadFiles = async (
    fileArray: File[],
    folderName: "estate_images" | "estate_documents"
  ) => {
    const isImages = folderName === "estate_images";
    const setUploading = isImages ? setIsUploadingImages : setIsUploadingDocs;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Validation selon le type
      const allowedTypes = isImages
        ? ["image/jpeg", "image/png"]
        : [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];

      const maxSize = 10 * 1024 * 1024; // 10MB

      for (const file of fileArray) {
        if (!allowedTypes.includes(file.type)) {
          toast.error(
            `Type de fichier non autorisé: ${file.name}. ${
              isImages ? "Formats: JPG, PNG" : "Formats: PDF, DOC, DOCX"
            }`
          );
          setUploading(false);
          return;
        }
        if (file.size > maxSize) {
          toast.error(`Fichier trop volumineux: ${file.name} (max 10MB)`);
          setUploading(false);
          return;
        }
      }

      const result = await uploadDocument(estate.id, fileArray, folderName);

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      const newUrls = result.data?.urls || [];

      // Mise à jour de l'état correspondant
      if (isImages) {
        setImages([...images, ...newUrls]);
      } else {
        setDocuments([...documents, ...newUrls]);
      }

      toast.success(result.message);
      setUploadProgress(100);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Erreur lors de l'upload des fichiers");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folderName: "estate_images" | "estate_documents"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files), folderName);
    }
    e.target.value = "";
  };

  // ========== SUPPRESSION ==========
  const handleDeleteFile = async (
    fileUrl: string,
    folderName: "estate_images" | "estate_documents"
  ) => {
    const isImages = folderName === "estate_images";

    try {
      const response = await deleteDocument(
        estate.id,
        [fileUrl],
        "user_documents"
      );

      if (response.status === "error") {
        toast.error(response.message);
        return;
      }

      if (isImages) {
        setImages(images.filter((url) => url !== fileUrl));
      } else {
        setDocuments(documents.filter((url) => url !== fileUrl));
      }

      toast.success(response.message);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Erreur lors de la suppression du fichier.");
    }
  };

  // ========== SOUMISSION ==========
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      formData.append("id", estate.id);

      formData.append("images", JSON.stringify(images));
      formData.append("documents", JSON.stringify(documents));
      formData.append("idGestionnaireAssigne", selectedGestionnaire);

      const result = await updateEstate(formData);

      if (result.status === "success") {
        toast.success(result.message);
        setTimeout(() => {
          router.push("/admin/estates");
          router.refresh();
        }, 1000);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du bien");
    } finally {
      setIsLoading(false);
    }
  };

  const getFileName = (url: string) => url.split("/").pop() || url;
  const getFileExtension = (url: string) =>
    getFileName(url).split(".").pop()?.toUpperCase() || "FILE";

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Bien immobilier</h1>
          <p className="text-gray-600">{estate.titre}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ligne 1: info + image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Building2Icon className="w-5 h-5 text-slate-600" />
                  Informations du Bien
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="titre"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Titre
                    </label>
                    <input
                      type="text"
                      id="titre"
                      name="titre"
                      defaultValue={estate.titre ?? ""}
                      required
                      disabled={isLoading}
                      className="px-small py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adresse"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      defaultValue={estate.adresse ?? ""}
                      required
                      disabled={isLoading}
                      className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        defaultValue={estate.type}
                        required
                        disabled={isLoading}
                        className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                      >
                        <option value="appartement">Appartement</option>
                        <option value="maison">Maison</option>
                        <option value="bureau">Bureau</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Statut
                      </label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={estate.status}
                        required
                        disabled={isLoading}
                        className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                      >
                        <option value="0">Disponible</option>
                        <option value="1">Loué</option>
                        <option value="2">Réservé</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="loyerMensuel"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Loyer (FCFA)
                      </label>
                      <input
                        type="number"
                        id="loyer_mensuel"
                        name="loyer_mensuel"
                        defaultValue={estate.loyer_mensuel ?? ""}
                        required
                        disabled={isLoading}
                        className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="rooms"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Pièces
                      </label>
                      <input
                        type="number"
                        id="rooms"
                        name="rooms"
                        defaultValue={estate.rooms ?? ""}
                        required
                        disabled={isLoading}
                        className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Surface (m²)
                      </label>
                      <input
                        type="number"
                        id="area"
                        name="area"
                        defaultValue={estate.area ?? ""}
                        required
                        disabled={isLoading}
                        className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gestion des Images */}
            <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                  Images
                </h2>
              </div>
              <div className="p-6">
                <div
                  onDragEnter={handleDragImages}
                  onDragLeave={handleDragImages}
                  onDragOver={handleDragImages}
                  onDrop={handleDropImages}
                  className={`relative rounded-md border-2 border-dashed transition-all ${
                    dragActiveImages
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <div className="p-6 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      onChange={(e) =>
                        handleFileInputChange(e, "estate_images")
                      }
                      disabled={isLoading || isUploadingImages}
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex justify-center mb-2">
                        {isUploadingImages ? (
                          <Loader className="h-8 w-8 text-green-600 animate-spin" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {isUploadingImages
                          ? "Upload en cours..."
                          : "Glissez vos images ici"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, WEBP (Max 10MB)
                      </p>
                    </label>
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                      <div
                        className="h-full bg-green transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {images.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">
                      Images ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {images.map((imgUrl) => (
                        <div
                          key={imgUrl}
                          className="relative group rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <img
                            src={imgUrl}
                            alt="Bien"
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteFile(imgUrl, "estate_images")
                            }
                            disabled={isLoading || isUploadingImages}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 text-center py-6">
                    <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune image</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ligne 2: Gestionnaire + Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gestionnaire */}
            <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                  Gestionnaire
                </h2>
              </div>
              <div className="p-6">
                <label
                  htmlFor="gestionnaire"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Sélectionner un gestionnaire
                </label>
                <select
                  id="id_gestionnaire"
                  name="id_gestionnaire"
                  value={selectedGestionnaire}
                  onChange={(e) => setSelectedGestionnaire(e.target.value)}
                  disabled={isLoading}
                  className="px-xsmall py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                >
                  <option value="">-- Aucun gestionnaire --</option>
                  {gestionnaires.map((gest) => (
                    <option key={gest.id} value={gest.id}>
                      {gest.prenom} {gest.nom}
                    </option>
                  ))}
                </select>
                {selectedGestionnaire && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Gestionnaire assigné
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-sm  border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  Documents
                </h2>
              </div>
              <div className="p-6">
                <div
                  onDragEnter={handleDragDocs}
                  onDragLeave={handleDragDocs}
                  onDragOver={handleDragDocs}
                  onDrop={handleDropDocs}
                  className={`relative rounded-md border-2 border-dashed transition-all ${
                    dragActiveDocs
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <div className="p-6 text-center">
                    <input
                      type="file"
                      id="doc-upload"
                      onChange={(e) =>
                        handleFileInputChange(e, "estate_documents")
                      }
                      disabled={isLoading || isUploadingDocs}
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer">
                      <div className="flex justify-center mb-2">
                        {isUploadingDocs ? (
                          <Loader className="h-8 w-8 text-purple-600 animate-spin" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {isUploadingDocs
                          ? "Upload en cours..."
                          : "Glissez vos documents"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                    </label>
                  </div>
                </div>

                {documents.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">
                      Documents ({documents.length})
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {documents.map((docUrl) => (
                        <div
                          key={docUrl}
                          className="flex items-center justify-between rounded-md border border-gray-200 bg-background p-3 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="shrink-0 h-8 w-8 rounded-md bg-purple-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline truncate block"
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
                            onClick={() =>
                              handleDeleteFile(docUrl, "estate_documents")
                            }
                            disabled={isLoading || isUploadingDocs}
                            className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 text-center py-6">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun document</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || isUploadingImages || isUploadingDocs}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary/80 px-6 py-3 text-sm font-semibold text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md cursor-pointer"
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
    </div>
  );
}
