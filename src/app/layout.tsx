import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerege Guild | Discover the Soul of Mongolia",
  description: "Authentic nomadic experiences, timeless journeys, and unforgettable adventures. Your trusted guide across the Mongolian plateau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
