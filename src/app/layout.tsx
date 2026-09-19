import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIPS — Maritime Integrated Port Simulator",
  description: "Taruna Training Simulation Demo - Operational Port Berthing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
