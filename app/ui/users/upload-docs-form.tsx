"use client";

import Link from "next/link";
import {
  BanknotesIcon,
  BriefcaseIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
import { Button } from "@/app/ui/button";
import { State, uploadUserDocs } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";

export default function UploadDocsForm({ users }: { users: User[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(uploadUserDocs, initialState);
  return (
    <form action={formAction}>
      <div className="rounded-sm bg-gray-50 p-xsmall md:p-medium">
        {/* user nom */}
        <div className="mb-4">
          <label htmlFor="nom" className="mb-2 block text-sm font-medium">
            Utilisateurs
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Selectionner un utilisateur
              </option>
              {users.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.nom} {user.prenom}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* customer error */}
          <div id="nom-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.nom &&
              state.errors.nom.map((error: string) => (
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
        <Button type="submit" className="cursor-pointer w-full">
          Uploader
        </Button>
      </div>
    </form>
  );
}
