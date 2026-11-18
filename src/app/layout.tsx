import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ventus Barbería - Tu Estilo, Nuestra Pasión",
  description: "Barbería moderna en Buenos Aires. Reservá tu turno online para cortes, barba y styling premium.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={newsreader.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
