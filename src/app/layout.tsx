import type { Metadata } from "next";
import { Cinzel, Crimson_Text, IM_Fell_English } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "lenis/dist/lenis.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";
import ScrollAtmosphere from "@/components/ScrollAtmosphere";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const imFell = IM_Fell_English({
  variable: "--font-im-fell",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gerege Guild | Charters Across the Mongolian Wild",
  description:
    "First choose the Mongolia you want to meet. Then we build the full charter around it — route, vehicle, host and guide. Every charter is built from the road upward.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${crimson.variable} ${imFell.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <ScrollAtmosphere />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
