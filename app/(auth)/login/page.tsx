import LoginForm from "@/app/ui/login-form";
import SCIDialaliLogo from "@/app/ui/sci-dialali-logo";
import { Suspense } from "react";

export default function Login() {
  return (
    <div>
      <main className="flex justify-center items-center h-screen">
        <div
          className="relative mx-auto flex w-full max-w-[400px] 
        flex-col space-y-2.5 p-small"
        >
          <div className="flex h-20 w-full justify-center items-center md:h-36">
            <SCIDialaliLogo />
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
