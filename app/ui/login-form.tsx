"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { authenticate } from "../lib/actions";
import { toast } from "react-hot-toast";
import { KeyIcon, PhoneIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [formValue, setFormValue] = useState({ contact: "" });

  const [state, formAction, isProccessing] = useActionState(authenticate, {
    status: "idle",
    message: "",
    data: {},
    fieldErrors: {},
    httpStatus: 0,
  });

  useEffect(() => {
    if (!state.message) return;

    if (state.fieldErrors && Object.keys(state.fieldErrors).length > 0) {
      toast.error(state.message);
    }

    if (state.status === "error") {
      toast.error(state.message || "Erreur d'authentification");
    } else if (state.status === "success") {
      toast.success(state.message || "Connexion réussie !");
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <form action={formAction} className="space-y-3">
        <h1 className="mb-3 text-2xl">Se connecter</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Contact
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="tel"
                type="contact"
                name="contact"
                placeholder="Votre contact: +225XXXXXXX"
                value={formValue.contact}
                onChange={handleChange}
                required
                disabled={isProccessing}
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="contact-error" aria-live="polite" aria-atomic="true">
            {state.fieldErrors?.contact &&
              state.fieldErrors.contact.map((error) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Mot de passe"
                required
                minLength={4}
                disabled={isProccessing}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.fieldErrors?.password &&
                state.fieldErrors.password.map((error) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
        </div>
        <button
          type="submit"
          className="mt-4 w-full cursor-pointer bg-primary rounded-md flex items-center p-xsmall text-white"
          disabled={isProccessing}
        >
          {isProccessing ? "Connexion..." : "Connexion "}
          <ArrowRightIcon className="ml-auto h-5 w-5" />
        </button>
      </form>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-small">
        <p>Vous n'avez pas encore de compte ?</p>
        <Link
          href="/register"
          className="font-medium text-primary/60 hover:text-primary hover:underline transition-colors"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
