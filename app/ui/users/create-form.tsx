"use client";

import Link from "next/link";
import {
  BanknotesIcon,
  BriefcaseIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState, useState } from "react";
import { Button } from "@/app/ui/button";
import { createUser } from "@/app/lib/actions";

export default function CreateUserForm() {
  const [formValues, setFormValues] = useState({
    nom: "",
    prenom: "",
    password: "",
    email: "",
    contact: "",
    profession: "",
    revenu: "",
  });

  const [state, formAction, isPending] = useActionState(createUser, {
    errors: {},
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form action={formAction}>
      <div className="rounded-sm bg-gray-50 p-xsmall md:p-medium">
        {/* user nom */}
        <div className="mb-4">
          <label htmlFor="nom" className="mb-2 block text-sm font-medium">
            Nom
          </label>
          <div className="relative">
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Nom"
              autoComplete="family-name"
              value={formValues.nom}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="nom-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.nom &&
              state.errors.nom.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Prénom */}
        <div className="mb-4">
          <label htmlFor="prenom" className="mb-2 block text-sm font-medium">
            Prénom
          </label>
          <div className="relative">
            <input
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Prénom"
              autoComplete="given-name"
              value={formValues.prenom}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="prenom-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.prenom &&
              state.errors.prenom.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Mot de passe */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              autoComplete="new-password"
              value={formValues.password}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="prenom-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.password &&
              state.errors.password.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              type="text"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="ex: stephane@domain.com"
              value={formValues.email}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
            Contact
          </label>
          <div className="relative">
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="ex: +22501023096"
              autoComplete="mobile tel"
              value={formValues.contact}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <DevicePhoneMobileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="contact-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.contact &&
              state.errors.contact.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Profession */}
        <div className="mb-4">
          <label
            htmlFor="profession"
            className="mb-2 block text-sm font-medium"
          >
            Profession
          </label>
          <div className="relative">
            <input
              type="text"
              id="profession"
              name="profession"
              placeholder="Ingenieur"
              autoComplete="organization"
              value={formValues.profession}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="profession-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.profession &&
              state.errors.profession.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Revenu */}
        <div className="mb-4">
          <label htmlFor="revenu" className="mb-2 block text-sm font-medium">
            Revenu
          </label>
          <div className="relative">
            <input
              type="number"
              id="revenu"
              name="revenu"
              placeholder="Votre revenu mensuel"
              autoComplete="off"
              value={formValues.revenu}
              onChange={handleChange}
              className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
            />
            <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="revenu-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.revenu &&
              state.errors.revenu.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      {/* Global error */}
      <div aria-live="polite" aria-atomic="true">
        {state?.message ? (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        ) : (
          ""
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="w-full h-10 rounded-lg bg-gray-100 text-sm flex 
          justify-center items-center
          font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Annuler
        </Link>
        <Button
          type="submit"
          disabled={isPending}
          className="cursor-pointer w-full flex 
          justify-center items-center"
        >
          {isPending ? "ajout..." : "Ajouter utilisateur"}
        </Button>
      </div>
    </form>
  );
}
