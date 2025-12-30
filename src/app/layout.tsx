import type { Metadata } from "next";
import "./globals.css";
import MUIThemeProvider from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";

export const metadata: Metadata = {
  title: "Ventus Barbería - Tu Estilo, Nuestra Pasión",
  description: "Barbería moderna en Buenos Aires. Reservá tu turno online para cortes, barba y styling premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MUIThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </MUIThemeProvider>
      </body>
    </html>
  );
}
