

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meet 4.ai - AI-Powered Meeting Scheduler",
  description:
    "Find optimal meeting times and central locations for 3 people using AI",
  icons: {
    icon: "/favicon.ico", // Path to your favicon in public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className + " bg-white text-black"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

