import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curio - Smart Introductions for Organisations",
  description: "Connect people who should meet through intelligent matching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
