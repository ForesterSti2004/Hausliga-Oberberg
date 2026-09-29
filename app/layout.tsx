import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hausliga · Ergebnisse", description: "Ergebnisse der Hausliga im Bowlingcenter Oberberg" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}<div className="legal-footer"><a href="/datenschutz">Datenschutz</a></div></body></html>;
}
