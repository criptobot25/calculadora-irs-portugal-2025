import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ClientProviders } from '@/components/layout/ClientProviders'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Calculadora IRS Portugal 2025",
  description: "Calcule o seu IRS de forma gratuita e simples",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
