import type { Metadata, Viewport } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SCIDialaliLogo from "./ui/sci-dialali-logo";

export const roboto = Roboto({
  weight: ["400", "500", "700"], // Regular, Medium, Bold
  subsets: ["latin"],
  variable: "--font-body",
});

export const montserrat = Montserrat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "SCI DIALALI",
  description: "Entreprise Specialisée locatif",
  openGraph: {
    title: "SCI DIALALI",
    description: "Entreprise Specialisée locatif.",
    type: "website",
    url: "",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${montserrat.variable} antialiased`}>
        <Providers>{children}</Providers>
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
      </body>
    </html>
  );
}
