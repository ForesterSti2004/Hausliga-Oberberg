"use client";

import { useId, useRef } from "react";
import { teamHistory } from "@/lib/team-history";
import { scheduleDate, teamName } from "@/lib/next-season";
import { groupStandings, type Score, type Baker } from "@/lib/next-standings";

const format=(value:number|null)=>value===null?"–":value.toLocaleString("de-DE");

export function TeamHistory({teamId,scores,bakers}:{teamId:number;scores:Score[];bakers:Baker[]}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const titleId=useId();
  const rows=teamHistory(teamId,scores,bakers);
  const standing=groupStandings(teamId<=5?1:2,scores,bakers).find(team=>team.id===teamId);
  if(!teamId)return <>Freigegner</>;
  return <>
    <button type="button" className="player-history-link" onClick={()=>dialog.current?.showModal()} aria-haspopup="dialog" aria-label={`Alle Ergebnisse von ${teamName(teamId)} ansehen`}>{teamName(teamId)}</button>
    <dialog ref={dialog} className="player-history-dialog team-history-dialog" aria-labelledby={titleId} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close()}}>
      <div className="player-history-content">
        <div className="player-history-heading"><div><h2 id={titleId}>{teamName(teamId)}</h2><p>Gruppe {teamId<=5?1:2} · Saison 2026/2027</p></div><button type="button" className="player-history-close" onClick={()=>dialog.current?.close()} aria-label="Mannschaftsübersicht schließen">×</button></div>
        <p className="player-history-stats"><strong>{standing?.games??0}</strong> gewertete Spiele · <strong>{format(standing?.pins??0)}</strong> gewertete Pins · <strong>{standing?.points??0}</strong> Punkte</p>
        {rows.length?<div className="table-wrap"><table><thead><tr><th>Spieltag</th><th>Datum</th><th>Gegner</th>{["Spiel 1","Spiel 2","Spiel 3","Baker 1","Baker 2","Baker 3"].map(label=><th key={label}>{label}</th>)}<th>Gesamtpins</th><th>Punkte</th></tr></thead><tbody>{rows.map(row=><tr key={row.day}><td>{row.day}</td><td>{new Intl.DateTimeFormat("de-DE",{timeZone:"UTC"}).format(new Date(`${scheduleDate(row.day,row.group)}T12:00:00Z`))}</td><td>{teamName(row.opponent)}</td>{row.games.map((game,index)=><td key={index}>{format(game.pins)}{game.pins!==null&&!game.complete?"*":""}</td>)}<td>{format(row.pins)}{!row.complete?"*":""}</td><td>{row.points}</td></tr>)}</tbody></table></div>:<p>Noch keine Mannschaftsergebnisse erfasst.</p>}
        <p className="context-note">Die normalen Spiele zeigen die Summe der Spielerpins. * Noch unvollständig erfasst. Die Punkte entsprechen dem aktuellen Auswertungsstand; gewertete Pins zählen nur vollständig erfasste Spiele.</p>
      </div>
    </dialog>
  </>;
}
