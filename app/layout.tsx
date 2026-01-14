import type { Metadata, Viewport } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

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
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            success: {
              style: {
                background: "#10b981",
                color: "#fff",
                fontWeight: "600",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "#fff",
                fontWeight: "600",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
