import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "TRC — The Recruitment Challenge",
  description: "AAG Division recruitment tracker, from exploration to RNF.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">{children}</main>
      </body>
    </html>
  );
}
