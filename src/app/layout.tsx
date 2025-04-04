import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Book Store",
  authors: [{ name: "Book Store" }],
  keywords: ["Book Store", "Books", "Online Store"],
  creator: "Book Store",
  publisher: "Book Store",
  openGraph: {
    title: "Book Store",
    description: "Book Store - Your one-stop shop for all your book needs.",
    url: "https://bookstore.com",
    siteName: "Book Store",
    images: [
      {
        url: "https://bookstore.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Book Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Store",
    description: "Book Store - Your one-stop shop for all your book needs.",
    images: ["https://bookstore.com/og-image.jpg"],
    creator: "@bookstore",
  },

  description: "Book Store - Your one-stop shop for all your book needs.",
  themeColor: "#ffffff",
  appleWebApp: {
    title: "Book Store",
    statusBarStyle: "default",
    capable: true,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Navbar/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
