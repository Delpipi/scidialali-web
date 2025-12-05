import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateEstate() {
  return (
    <Link
      href="/dashboard/estates/create"
      className="flex h-10 items-center justify-between rounded-lg bg-primary px-small text-sm font-medium py-2 
       text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Ajouter un bien
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateEstate({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/estate/${id}/edit`}
      className="rounded-md border p-2 hover:bg-primary hover:text-white"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
