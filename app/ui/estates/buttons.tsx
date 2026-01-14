import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { LinkButton } from "../button";

export function CreateEstate() {
  return (
    <LinkButton href="/admin/estates/create">
      Ajouter
      <PlusIcon className="h-5 md:ml-4" />
    </LinkButton>
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
