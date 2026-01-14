import SCIDialaliLogo from "./ui/sci-dialali-logo";
import Link from "next/link";
import EstateFilters from "./ui/estates/estate-filters";
import EStatesList from "./ui/estates/estate-list";
import { HeaderNav } from "./ui/header-nav";
import ListLoader from "./ui/loader";
import { Suspense } from "react";
import { auth } from "@/auth";

export default async function Home(props: {
  searchParams?: Promise<{
    type?: string;
    minRent?: string;
    maxRent?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const type = searchParams?.type || "";
  const minRent = Number(searchParams?.minRent) || 0;
  const maxRent = Number(searchParams?.maxRent) || 0;
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-small h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <SCIDialaliLogo />
          </Link>
          <HeaderNav user={session?.user} />
        </div>
      </header>

      {/* Hero */}
      <section className="py-large md:py-24 bg-gray-200">
        <div className="mx-auto px-small md:px-xsmall">
          <div className="text-center mb-small">
            <h1 className="text-3xl md:text-5xl font-bold mb-xsmall animate-slide-up">
              Trouvez votre bien idéal
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto animate-fade-in">
              Découvrez notre sélection de biens disponibles à la location
            </p>
          </div>
        </div>
      </section>

      {/* Properties List */}
      <section className="py-medium">
        <div className="mx-auto px-small max-w-6xl">
          <div>
            <EstateFilters />
          </div>
          <Suspense
            key={type + minRent + maxRent + search + currentPage}
            fallback={<ListLoader />}
          >
            <EStatesList
              type={type}
              minRent={minRent}
              maxRent={maxRent}
              search={search}
              currentPage={currentPage}
            />
          </Suspense>
        </div>
      </section>

      <section>
        {/* Footer */}
        <footer className="bg-gray-100 border-t-2 border-gray-300 py-large">
          <div className="mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-xsmall">
              <SCIDialaliLogo />
            </div>
            <p className="text-sm text-gray-500">
              © 2026 SCI DIALALI - Tous droits Réservé. Application de gestion
              immobilière.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
