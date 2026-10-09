import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apixa × Next.js",
  description: "Real usage of @apixa/core inside a Next.js App Router app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
