import {
  deleteEstate,
  deleteRentalRequest,
  deleteUser,
} from "@/app/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

/*******************************************
 * *************** USER ********************
 *******************************************/
export function CreateUser() {
  return (
    <Link
      href="/admin/users/create"
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
      href={`/admin/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-primary hover:text-white"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUser({ id }: { id: string }) {
  const deleteUserWithId = deleteUser.bind(null, id);
  return (
    <form action={deleteUserWithId}>
      <button
        type="submit"
        className="rounded-md border p-2 hover:bg-primary hover:text-white cursor-pointer"
      >
        <span className="sr-only">Supprimer</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

/*******************************************
 * *************** ESTATE ******************
 *******************************************/

export function UpdateEstate({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/estates/${id}/edit`}
      className="rounded-md border p-2 hover:bg-primary hover:text-white"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteEstate({ id }: { id: string }) {
  const deleteEstateWithId = deleteEstate.bind(null, id);
  return (
    <form action={deleteEstateWithId}>
      <button
        type="submit"
        className="inline-flex items-center justify-center font-semibold transition cursor-pointer rounded-sm h-11 px-5
        border-2 border-primary text-primary hover:text-white hover:bg-primary"
      >
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function ViewRentalRequest({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/rental_requests/${id}`}
      className="rounded-md border p-2.5 hover:bg-primary hover:text-white"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function DeleteRentalRequest({ id }: { id: string }) {
  const deleteRentalRequestWithId = deleteRentalRequest.bind(null, id);
  return (
    <form action={deleteRentalRequestWithId}>
      <button
        type="submit"
        className="rounded-md border p-2.5 hover:bg-primary hover:text-white cursor-pointer"
      >
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
