import { getAllUsers } from "@/app/lib/actions";
import UserStatus from "./user-status";
import { DeleteUser, UpdateUser } from "../buttons";
import { formatDateToLocal, formatRelativeDate } from "@/app/lib/utils";
import {
  BriefcaseBusiness,
  Calendar,
  MailIcon,
  SmartphoneIcon,
  UserRoundCheck,
} from "lucide-react";
import { PublicUser } from "@/app/lib/definitions";

export default async function UsersTable({
  search,
  currentPage,
}: {
  search?: string;
  currentPage: number;
}) {
  let users: PublicUser[] = [];
  users = await getAllUsers({
    order_by: "created_at",
    currentPage: currentPage,
  });

  const displayData = users.filter((user) => {
    if (!search) return true;
    return (
      user.nom?.toLowerCase().includes(search.toLowerCase()) ||
      user.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.contact?.includes(search) ||
      user.profession?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (displayData.length === 0) {
    return <p className="text-center py-small">Aucun utilisateur trouvé.</p>;
  }

  return (
    <div className="mt-small flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-primary/10 p-xsmall md:pt-0">
          <div className="md:hidden">
            {displayData.map((user) => {
              const formattedDate = formatRelativeDate(user.created_at);
              return (
                <div
                  key={user.id}
                  className="mb-2 w-full rounded-md bg-white p-xsmall"
                >
                  <div className="flex items-center justify-between border-b border-primary pb-xsmall">
                    <div>
                      <div className="flex items-center gap-xsmall">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            user.is_active ? "bg-emerald-400" : "bg-rose-400"
                          } flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                        >
                          {user.prenom?.[0]?.toUpperCase() || "?"}
                          {user.nom?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-base">
                            {user.prenom} {user.nom}
                          </p>
                          {formattedDate && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-xsmall">
                        <SmartphoneIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {user.contact}
                        </p>
                      </div>
                      <div className="flex items-start gap-xsmall">
                        <MailIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {user.email}
                        </p>
                      </div>

                      <div className="flex items-start gap-xsmall">
                        <BriefcaseBusiness className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {user.profession}
                        </p>
                      </div>
                    </div>
                    <UserStatus status={user.is_active} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateUser id={user.id} />
                    <DeleteUser id={user.id} />
                  </div>
                </div>
              );
            })}
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
                  Role
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
              {displayData.map((user) => {
                const formattedDate = formatRelativeDate(user.created_at);
                return (
                  <tr
                    key={user.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-xsmall">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            user.is_active ? "bg-emerald-400" : "bg-rose-400"
                          } flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                        >
                          {user.prenom?.[0]?.toUpperCase() || "?"}
                          {user.nom?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-base">
                            {user.prenom} {user.nom}
                          </p>
                          {formattedDate && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-start gap-xsmall">
                        <SmartphoneIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {user.contact}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-start gap-xsmall">
                        <MailIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {user.email}
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-start gap-xsmall">
                        <UserRoundCheck className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-700">
                          {user.role}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <UserStatus status={user.is_active} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateUser id={user.id} />
                        <DeleteUser id={user.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
