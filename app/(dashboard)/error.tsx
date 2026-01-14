"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/app/lib/definitions";

/**
 * Détection robuste d'une erreur 401
 * (compatible erreurs serveur, client, sérialisées)
 */
function is401Error(error: unknown): boolean {
  const e = error as { status?: number; message?: string };

  return (
    e?.status === 401 ||
    (e instanceof ApiError && e.status === 401) ||
    e?.message?.includes("401") ||
    e?.message?.toLowerCase?.().includes("unauthorized") ||
    e?.message?.toLowerCase?.().includes("non authentifié") ||
    false
  );
}

function isAccountDisabled(error: unknown): boolean {
  const e = error as { status?: number; message?: string };

  return (
    e?.status === 403 ||
    e?.message?.toLowerCase?.().includes("désactivé") ||
    e?.message?.toLowerCase?.().includes("desactive") ||
    e?.message?.toLowerCase?.().includes("compte a été désactivé") ||
    false
  );
}

export default function Error({
  error,
}: {
  error: Error & { status?: number; digest?: string };
  reset: () => void;
}) {
  const searchParams = useSearchParams();

  // Sécurisation du callbackUrl (évite redirection externe)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const isDisabled = isAccountDisabled(error);
  const is401 = is401Error(error) && !isDisabled;

  useEffect(() => {
    if (!is401) return;

    // Déconnexion + redirection agressive (évite les loops NextAuth)
    signOut({ redirect: false }).then(() => {
      window.location.replace(callbackUrl);
    });
  }, [is401, callbackUrl]);

  const reset = () => {
    window.location.replace(callbackUrl); // Redirection après réinitialisation
  };

  // UX minimale pendant la redirection
  if (is401) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-md">
          <div className="text-7xl mb-6">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Session expirée
          </h1>
          <p className="text-gray-600">
            Vous avez été déconnecté. Redirection en cours…
          </p>
        </div>
      </div>
    );
  }

  if (isDisabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-md">
          <div className="text-7xl mb-6">⛔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Compte désactivé
          </h1>
          <p className="text-gray-600 mb-6">
            Votre compte a été désactivé.
            <br />
            Veuillez contacter le support pour plus d’informations.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-6 py-2 bg-primary/50 text-white rounded-md hover:bg-primary/80"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // Autres erreurs
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-gray-600 mb-6">
          {error.message || "Erreur inconnue"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary text-white rounded-md cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
