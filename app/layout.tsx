import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/api";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "DYOR-style memecoin launchpad on Stable chain (988)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
