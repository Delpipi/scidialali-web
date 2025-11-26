import { getAllUsers } from "@/app/lib/actions";
import Image from "next/image";
import InvoiceStatus from "./status";
import UserStatus from "./status";
import { DeleteUser, UpdateUser } from "./buttons";
import { formatDateToLocal } from "@/app/lib/utils";

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await getAllUsers(currentPage);

  return (
    <div className="mt-small flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-primary/10 p-xsmall md:pt-0">
          <div className="md:hidden">
            {users
              ?.filter(
                (user) =>
                  user.nom.includes(query) ||
                  user.prenom.includes(query) ||
                  user.email.includes(query) ||
                  user.contact.includes(query) ||
                  user.profession.includes(query) ||
                  user.role.includes(query) ||
                  user.revenu == Number(query)
              )
              .map((user) => (
                <div
                  key={user.uid}
                  className="mb-2 w-full rounded-md bg-white p-xsmall"
                >
                  <div className="flex items-center justify-between border-b border-primary pb-xsmall">
                    <div>
                      <p className="text-sm text-gray-500">
                        {user.nom} {user.prenom}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.contact}</p>
                      <p className="text-sm text-gray-500">{user.profession}</p>
                    </div>
                    <UserStatus status={user.disabled ?? false} />
                  </div>
                  <div className="flex w-full items-center justify-between pt-xsmall">
                    <div>
                      <p>{formatDateToLocal(user.createdAt ?? "")}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateUser id={user.uid} />
                      <DeleteUser id={user.uid} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal text-primary">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nom et Prenom
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user) => (
                <tr
                  key={user.uid}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {user.nom} {user.prenom}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.contact}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{user.email}</td>

                  <td className="whitespace-nowrap px-3 py-3">{user.role}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <UserStatus status={user.disabled ?? false} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateUser id={user.uid} />
                      <DeleteUser id={user.uid} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
