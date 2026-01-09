"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BanknotesIcon,
  BriefcaseIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState, useState } from "react";
import { register } from "../lib/actions";

export default function RegistrationForm() {
  const [formValues, setFormValues] = useState({
    nom: "",
    prenom: "",
    password: "",
    email: "",
    contact: "",
    profession: "",
    revenu: "",
  });

  const [state, formAction, isPending] = useActionState(register, {
    errors: {},
    status: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <form className="space-y-3" action={formAction}>
        <h1 className="mb-3 text-2xl">S'inscrire</h1>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Nom */}
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
              {state?.errors?.nom?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            {/* Prénom */}
            <div className="mb-4">
              <label
                htmlFor="prenom"
                className="mb-2 block text-sm font-medium"
              >
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
              {state?.errors?.prenom?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            {/* Mot de passe */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
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
              {state?.errors?.password?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
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
                  placeholder="ex: stephane@domain.com"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                />
                <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state?.errors?.email?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            {/* Contact */}
            <div className="mb-4">
              <label
                htmlFor="contact"
                className="mb-2 block text-sm font-medium"
              >
                Contact
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  placeholder="ex: +22501023096"
                  value={formValues.contact}
                  onChange={handleChange}
                  className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                />
                <DevicePhoneMobileIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state?.errors?.contact?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
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
                  placeholder="Ingénieur"
                  value={formValues.profession}
                  onChange={handleChange}
                  className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                />
                <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state?.errors?.profession?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            {/* Revenu */}
            <div className="mb-4">
              <label
                htmlFor="revenu"
                className="mb-2 block text-sm font-medium"
              >
                Revenu
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="revenu"
                  name="revenu"
                  placeholder="Votre revenu mensuel"
                  value={formValues.revenu}
                  onChange={handleChange}
                  className="px-large py-xsmall bg-gray-100 outline-2 outline-gray-600 rounded-sm w-full placeholder-gray-500"
                />
                <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state?.errors?.revenu?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Global error */}
        <div aria-live="polite" aria-atomic="true">
          {state?.message ? (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="mt-2 text-sm text-red-500">{state.message}</p>
            </>
          ) : (
            ""
          )}
        </div>

        <Button className="mt-4 w-full cursor-pointer" disabled={isPending}>
          {isPending ? "Inscription..." : "S'inscrire"}{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </form>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-small">
        <p>Vous avez déjà un compte ?</p>
        <Link
          href="/"
          className="font-medium text-primary/60 hover:text-primary hover:underline transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
