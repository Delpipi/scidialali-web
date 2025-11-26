import { Suspense } from "react";
import LoginForm from "./ui/login-form";
import SCIDialaliLogo from "./ui/sci-dialali-logo";
export default function Home() {
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

/* Auth → http://localhost:9099
Firestore → http://localhost:8181 
UI Emulator Dashboard → http://localhost:4000
// lib/firebase/client.ts
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-key",
  authDomain: "your-domain",
  projectId: "your-project-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connecter aux émulateurs uniquement en développement
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
*/
