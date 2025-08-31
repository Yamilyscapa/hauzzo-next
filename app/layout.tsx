import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavWrapper from "@/components/shared/nav-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hauzzo",
  description: "Hauzzo, tu agencia inmobiliaria en Puebla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased overflow-y-scroll`}>
        {/* Site nav renders itself inside a container; admin pages render nothing */}
        <NavWrapper />
        {children}
      </body>
    </html>
  );
}
