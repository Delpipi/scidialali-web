// app/error.tsx
"use client"; // ← même si tu ne l'écris pas, Next.js le fait pour toi

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { ApiError } from "./lib/definitions";

export default function Error({
  error,
  reset,
}: {
  error: Error & { status?: number; digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Détection la plus large possible du 401
    const isUnauthorized =
      error?.status === 401 ||
      (error as any)?.status === 401 ||
      error.message?.includes("401") ||
      error.message?.toLowerCase().includes("non authentifié") ||
      error.message?.toLowerCase().includes("unauthorized") ||
      (error.message?.includes("ApiError") && (error as any).status === 401);

    if (isUnauthorized) {
      // Déconnexion + redirection agressive
      signOut({ redirect: false }).then(() => {
        window.location.replace("/login");
      });
    }
  }, [error]);

  // Affichage selon le type d'erreur
  const is401 =
    error?.status === 401 ||
    (error as any)?.status === 401 ||
    error.message?.toLowerCase().includes("non authentifié") ||
    error.message?.toLowerCase().includes("unauthorized") ||
    error.message?.includes("401") ||
    (error instanceof ApiError && error.status === 401);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
        {is401 ? (
          <>
            <div className="text-7xl mb-6">🔐</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Session expirée
            </h1>
            <p className="text-gray-600 mb-6">
              Vous avez été déconnecté. Redirection en cours...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-gray-600 mb-6">
              {error.message || "Erreur inconnue"}
            </p>
            <button
              onClick={reset}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
