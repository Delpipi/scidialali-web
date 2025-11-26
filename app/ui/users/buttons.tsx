import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateUser() {
  return (
    <Link
      href="/dashboard/users/create"
      className="flex h-10 items-center rounded-lg bg-primary px-small text-sm font-medium 
       text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="hidden md:block">Ajouter un utilisateur</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateUser({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-primary hover:text-white"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUser({ id }: { id: string }) {
  return (
    <>
      <form>
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-primary hover:text-white cursor-pointer"
        >
          <span className="sr-only">Supprimer</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
