import type { Metadata } from "next";
import "./globals.css";
import MUIThemeProvider from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Ventus - Sistema de Turnos",
  description: "Sistema de gestión de turnos médicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <MUIThemeProvider>{children}</MUIThemeProvider>
      </body>
    </html>
  );
}
