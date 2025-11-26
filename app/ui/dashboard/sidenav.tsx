import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col p-xsmall">
      <div
        className="flex w-full h-20 items-end justify-start p-small mb-small text-white rounded-md bg-primary 
      md:h-40 md:items-center md:justify-center"
      >
        <Image
          src="/launcher.png"
          width={90}
          height={90}
          alt="Launcher Icon"
          className="hidden md:block"
        />
        <h1 className="text-2xl uppercase md:hidden">SCI DIALALI</h1>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button
            className="flex h-12 w-full grow items-center justify-center gap-xsmall p-small
          rounded-md bg-gray-50 text-sm font-medium hover:bg-primary/10 hover:text-primary
          md:flex-none md:justify-start md:p-xsmall cursor-pointer"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Déconnecter</div>
          </button>
        </form>
      </div>
    </div>
  );
}
