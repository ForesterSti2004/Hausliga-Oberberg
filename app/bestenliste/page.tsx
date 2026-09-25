"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Award } from "lucide-react";
import { bestBoards } from "@/lib/next-records";
import { playerTotals } from "@/lib/next-player-totals";
import type { Score, Baker } from "@/lib/next-standings";

export default function Records() {
  const [scores,setScores]=useState<Score[]>([]),[bakers,setBakers]=useState<Baker[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  useEffect(()=>{let active=true;fetch("/api/next-results",{cache:"no-store"}).then(async response=>{
    const data=await response.json() as {error?:string;scores:Score[];baker:Baker[]};
    if(!response.ok)throw Error(data.error||"Ergebnisse gerade nicht erreichbar.");
    if(active){setScores(data.scores);setBakers(data.baker);setLoading(false);}
  }).catch(e=>{if(active){setError(e instanceof Error?e.message:"Ergebnisse gerade nicht erreichbar.");setLoading(false)}});return()=>{active=false}},[]);
  const boards=useMemo(()=>bestBoards(scores,bakers),[scores,bakers]);
  const totals=useMemo(()=>playerTotals(scores),[scores]);
  return <div className="shell"><header className="topbar"><a className="brand" href="/" aria-label="Bowlingcenter Oberberg – Startseite"><Image className="brand-logo" src="/bowlingcenter-oberberg.png" width={564} height={139} alt="Bowlingcenter Oberberg" priority /></a></header><main className="container best-page"><a className="next-link" href="/kommende-saison">← Spielplan und Tabellen</a><div className="best-heading"><div><p className="eyebrow">BEIDE GRUPPEN · SAISON 2026/2027</p><h1>Bestenliste</h1><p>Die drei höchsten Ergebnisse je Kategorie.</p></div><Award size={42}/></div>{error?<p role="alert" className="best-error">{error}</p>:loading?<p>Lade Ergebnisse …</p>:<div className="best-grid">{boards.map(board=><section className="best-card" key={board.title}><h2>{board.title}</h2>{board.entries.length?<ol>{board.entries.map((entry,index)=><li key={entry.key}><span className="best-rank">{index+1}</span><div className="best-name"><strong>{entry.name}</strong><small>{entry.team!==entry.name?`${entry.team} · `:""}Spieltag {entry.day}{entry.game?` · Spiel ${entry.game}`:""}</small></div><strong className="best-pins">{entry.pins.toLocaleString("de-DE")} <small>Pins</small></strong></li>)}</ol>:<p className="best-empty">Noch keine Ergebnisse erfasst.</p>}</section>)}</div>}{!loading&&!error&&<section className="all-players"><h2>Gesamttabelle Einzelspieler</h2><p>Alle normalen Einzelspiele aus beiden Gruppen der Saison 2026/2027.</p>{totals.length?<div className="table-wrap"><table><thead><tr><th>Platz</th><th>Spieler</th><th>Mannschaft</th><th>Gesamtspiele</th><th>Gesamtpins</th><th>Ø Pins</th></tr></thead><tbody>{totals.map((player,index)=><tr key={player.key}><td>{index+1}</td><td className="bold">{player.name}</td><td>{player.team}</td><td>{player.games}</td><td className="bold">{player.pins.toLocaleString("de-DE")}</td><td>{player.average.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1})}</td></tr>)}</tbody></table></div>:<p className="best-empty">Noch keine Einzelspielergebnisse erfasst.</p>}<p className="context-note">Nach Gesamtpins sortiert. Jedes eingetragene Einzelspiel zählt einmal; Baker-Teamspiele zählen nicht mit. Gleichnamige Spieler verschiedener Mannschaften bleiben getrennt.</p></section>}<p className="context-note">Normale Mannschaftsspiele zählen nach drei Spielergebnissen; ein Mannschaftsspieltag nach allen drei normalen und drei Baker-Spielen. Männer und Damen erscheinen nach Zuordnung bei der Ergebniseingabe.</p><footer>Bowlingcenter Oberberg · Hausliga</footer></main></div>;
}
