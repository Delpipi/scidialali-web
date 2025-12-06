import { Suspense } from "react";
import RegistrationForm from "../ui/register-form";
import SCIDialaliLogo from "../ui/sci-dialali-logo";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <main className="flex justify-center items-center h-screen">
        <div
          className="relative mx-auto flex w-full max-w-[600px] 
        flex-col space-y-2.5 p-small"
        >
          <div className="flex h-20 w-full justify-center items-center md:h-36">
            <SCIDialaliLogo />
          </div>
          <Suspense>
            <RegistrationForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
