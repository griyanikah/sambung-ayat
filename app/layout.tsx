import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sambung Ayat",
  description: "Latihan Hafalan Al-Qur'an Metode Sambung Ayat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        {/* GLOBAL HEADER */}
        <header className="w-full bg-white shadow px-6 py-3 flex gap-3 items-center">

          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            🏠 Beranda
          </Link>

          <Link
            href="/dashboard"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            📊 Riwayat Skor
          </Link>

          <Link
            href="/leaderboard"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            🏆 Leaderboard
          </Link>

        </header>

        {/* PAGE CONTENT */}
        <main>{children}</main>

      </body>
    </html>
  );
}