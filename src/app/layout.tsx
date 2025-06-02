import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hauzzo - Encuentra un hogar, pensado para ti",
  description: "Hauzzo es una plataforma de alquiler de propiedades en Puebla, México. Encuentra tu hogar ideal con nosotros.",
  keywords: "renta de casas puebla, renta de departamentos puebla, renta de oficinas puebla, renta de locales puebla, renta de terrenos puebla, renta de bodegas puebla, renta de garajes puebla, inmobiliaria puebla, propiedades en renta puebla, viviendas en renta puebla, casas en renta puebla, departamentos en renta puebla, oficinas en renta puebla, locales en renta puebla, terrenos en renta puebla, bodegas en renta puebla, garajes en renta puebla, renta de propiedades puebla, renta de viviendas puebla, renta de casas puebla, renta de departamentos puebla, renta de oficinas puebla, renta de locales puebla, renta de terrenos puebla, renta de bodegas puebla, renta de garajes puebla",
  authors: [{ name: "Hauzzo", url: "https://hauzzo.com" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      notranslate: true
    }
  },
  openGraph: {
    title: "Hauzzo - Encuentra un hogar, pensado para ti",
    description: "Hauzzo es una plataforma de alquiler de propiedades en Puebla, México. Encuentra tu hogar ideal con nosotros.",
    url: "https://hauzzo.com",
    type: "website",
    locale: "es_MX",
    siteName: "Hauzzo"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
