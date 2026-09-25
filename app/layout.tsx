import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hausliga · Ergebnisse", description: "Ergebnisse der Hausliga im Bowlingcenter Oberberg" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="de"><body>{children}</body></html>; }
