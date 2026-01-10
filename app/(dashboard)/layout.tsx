import SideNav from "@/app/ui/dashboard/sidenav";
import SCIDialaliLogo from "../ui/sci-dialali-logo";
import { LinkButton } from "../ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="w-full flex flex-col p-xsmall md:overflow-y-auto md:p-small">
        <div className="relative text-end">
          <LinkButton href="/" className="font-extrabold" variant="outline">
            Accueil
          </LinkButton>
        </div>
        {children}
      </div>
    </div>
  );
}
