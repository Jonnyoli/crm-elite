import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SI CRM | Soluções Ideais Coimbra - Mondego",
  description: "Plataforma de gestão imobiliária de luxo para a agência SI Coimbra - Mondego.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SI Elite CRM",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={`dark ${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
}
