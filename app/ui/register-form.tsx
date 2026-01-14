"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { register } from "../lib/actions";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  KeyIcon,
  MailIcon,
  SmartphoneIcon,
  UserCircleIcon,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RegistrationForm() {
  const [formValues, setFormValues] = useState({
    nom: "",
    prenom: "",
    password: "",
    email: "",
    contact: "",
    profession: "",
  });

  const [state, formAction, isProccessing] = useActionState(register, {
    status: "idle",
    message: "",
    data: {},
    fieldErrors: {},
    httpStatus: 0,
  });

  useEffect(() => {
    if (!state.message) return;

    if (state.fieldErrors && Object.entries(state.fieldErrors).length > 0) {
      toast.error(state.message);
    } else {
      toast.success(state.message);
      setTimeout(() => {
        window.location.replace("/login");
      }, 1000);
    }
  }, [state]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <form className="space-y-3" action={formAction}>
        <h1 className="mb-3 text-2xl">{"S'inscrire"}</h1>
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
              {state?.fieldErrors?.nom?.map((error) => (
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
              {state?.fieldErrors?.prenom?.map((error) => (
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
              {state?.fieldErrors?.password?.map((error) => (
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
                <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state?.fieldErrors?.email?.map((error) => (
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
                <SmartphoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              {state?.fieldErrors?.contact?.map((error) => (
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
              {state?.fieldErrors?.profession?.map((error) => (
                <p key={error} className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full cursor-pointer bg-primary rounded-md flex items-center p-xsmall text-white"
          disabled={isProccessing}
        >
          {isProccessing ? "Inscription..." : "S'inscrire"}
          <ArrowRightIcon className="ml-auto h-5 w-5" />
        </button>
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
