"use client";
import Image from "next/image";
import { TeamHistory } from "@/components/team-history";
import { PlayerHistory } from "@/components/player-history";
import { useEffect, useMemo, useState } from "react";
import { Award } from "lucide-react";
import { teamIds } from "@/lib/next-season";
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
  const groupResults=useMemo(()=>[1,2].map(group=>{
    const ids=new Set(teamIds(group));
    const groupScores=scores.filter(score=>ids.has(score.team_id));
    const groupBakers=bakers.filter(baker=>ids.has(baker.team_id));
    return {group,boards:bestBoards(groupScores,groupBakers),totals:playerTotals(groupScores)};
  }),[scores,bakers]);
  return <div className="shell"><header className="topbar"><a className="brand" href="/" aria-label="Bowlingcenter Oberberg – Startseite"><Image className="brand-logo" src="/bowlingcenter-oberberg.png" width={564} height={139} alt="Bowlingcenter Oberberg" priority /></a><div className="header-sponsor"><Image src="/koelsch-sponsor.webp" width={1012} height={889} alt="Zunft Kölsch – Das Kölsch für hier." /></div></header><main className="container best-page"><a className="next-link" href="/kommende-saison">← Spielplan und Tabellen</a><div className="best-heading"><div><p className="eyebrow">GRUPPE 1 UND 2 · SAISON 2026/2027</p><h1>Bestenliste</h1><p>Die drei höchsten Ergebnisse je Kategorie – getrennt nach Gruppe.</p></div><Award size={42}/></div>{error?<p role="alert" className="best-error">{error}</p>:loading?<p>Lade Ergebnisse …</p>:<><nav className="public-nav" aria-label="Gruppen"><a href="#gruppe-1">Gruppe 1</a><a href="#gruppe-2">Gruppe 2</a></nav>{groupResults.map(({group,boards,totals})=><section className="records-group" id={`gruppe-${group}`} key={group} aria-labelledby={`gruppe-${group}-titel`}><h2 id={`gruppe-${group}-titel`}>Gruppe {group}</h2><div className="best-grid">{boards.map(board=><section className="best-card" key={board.title}><h3>{board.title}</h3>{board.entries.length?<ol>{board.entries.map((entry,index)=><li key={entry.key}><span className="best-rank">{index+1}</span><div className="best-name">{entry.teamId&&entry.key.startsWith("player-")?<PlayerHistory name={entry.name} teamId={entry.teamId} scores={scores}/>:entry.teamId?<TeamHistory teamId={entry.teamId} scores={scores} bakers={bakers}/>:<strong>{entry.name}</strong>}<small>{entry.team!==entry.name?`${entry.team} · `:""}Spieltag {entry.day}{entry.game?` · Spiel ${entry.game}`:""}</small></div><strong className="best-pins">{entry.pins.toLocaleString("de-DE")} <small>Pins</small></strong></li>)}</ol>:<p className="best-empty">Noch keine Ergebnisse erfasst.</p>}</section>)}</div><section className="all-players"><h3>Einzelspieler · Gruppe {group}</h3><p>Alle normalen Einzelspiele der Gruppe {group} in der Saison 2026/2027. Namen anklicken, um alle Spiele anzusehen.</p>{totals.length?<div className="table-wrap"><table><thead><tr><th>Platz</th><th>Spieler</th><th>Mannschaft</th><th>Gesamtspiele</th><th>Gesamtpins</th><th>Ø Pins</th></tr></thead><tbody>{totals.map((player,index)=><tr key={player.key}><td>{index+1}</td><td className="bold"><PlayerHistory name={player.name} teamId={player.teamId} scores={scores}/></td><td><TeamHistory teamId={player.teamId} scores={scores} bakers={bakers}/></td><td>{player.games}</td><td className="bold">{player.pins.toLocaleString("de-DE")}</td><td>{player.average.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1})}</td></tr>)}</tbody></table></div>:<p className="best-empty">Noch keine Einzelspielergebnisse erfasst.</p>}<p className="context-note">Nach Gesamtpins sortiert. Jedes eingetragene Einzelspiel zählt einmal; Baker-Teamspiele und mit E markierte Ersatzspieler-Einsätze zählen nicht mit. Gleichnamige Spieler verschiedener Mannschaften bleiben getrennt.</p></section></section>)}</>}<p className="context-note">Normale Mannschaftsspiele zählen nach drei Spielergebnissen; ein Mannschaftsspieltag nach allen drei normalen und drei Baker-Spielen. Männer und Damen erscheinen nach Zuordnung bei der Ergebniseingabe. Ersatzspieler (E) zählen für die Mannschaft, aber nicht für persönliche Bestenlisten.</p><footer>Bowlingcenter Oberberg · Hausliga</footer></main></div>;
}
