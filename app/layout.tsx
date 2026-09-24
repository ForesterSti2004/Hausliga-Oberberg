import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hausliga · Ergebnisse", description: "Ergebnisse der Hausliga des 1. BSC Oberberg" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="de"><body>{children}</body></html>; }
