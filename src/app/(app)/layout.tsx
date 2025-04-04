import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <body>{children}</body>
    </>
  );
}
