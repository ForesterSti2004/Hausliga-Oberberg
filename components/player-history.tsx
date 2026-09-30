"use client";

import { useId, useRef } from "react";
import { playerHistory } from "@/lib/next-player-totals";
import { scheduleDate, teamName } from "@/lib/next-season";
import type { Score } from "@/lib/next-standings";

const format=(value:number|null)=>value===null?"–":value.toLocaleString("de-DE");

export function PlayerHistory({name,teamId,scores}:{name:string;teamId:number;scores:Score[]}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const titleId=useId();
  const rows=playerHistory(scores,teamId,name);
  const values=rows.flatMap(row=>[row.game_1,row.game_2,row.game_3]).filter((n):n is number=>n!==null);
  const pins=values.reduce((total,n)=>total+n,0);
  return <>
    <button type="button" className="player-history-link" onClick={()=>dialog.current?.showModal()} aria-haspopup="dialog" aria-label={`Alle Spiele von ${name} ansehen`}>{name}</button>
    <dialog ref={dialog} className="player-history-dialog" aria-labelledby={titleId} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close()}}>
      <div className="player-history-content">
        <div className="player-history-heading"><div><h2 id={titleId}>{name}</h2><p>{teamName(teamId)} · Saison 2026/2027</p></div><button type="button" className="player-history-close" onClick={()=>dialog.current?.close()} aria-label="Spielerübersicht schließen">×</button></div>
        <p className="player-history-stats"><strong>{values.length}</strong> Spiele · <strong>{format(pins)}</strong> Pins · <strong>Ø {values.length?(pins/values.length).toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1}):"–"}</strong> Pins</p>
        {rows.length?<div className="table-wrap"><table><thead><tr><th>Spieltag</th><th>Datum</th><th>Spiel 1</th><th>Spiel 2</th><th>Spiel 3</th><th>Summe</th></tr></thead><tbody>{rows.map(row=><tr key={`${row.day}-${row.slot}`}><td>{row.day}</td><td>{new Intl.DateTimeFormat("de-DE",{timeZone:"UTC"}).format(new Date(`${scheduleDate(row.day,teamId<=5?1:2)}T12:00:00Z`))}</td><td>{format(row.game_1)}</td><td>{format(row.game_2)}</td><td>{format(row.game_3)}</td><td>{format([row.game_1,row.game_2,row.game_3].reduce<number>((sum,n)=>sum+(n??0),0))}</td></tr>)}</tbody></table></div>:<p>Noch keine Einzelspiele erfasst.</p>}
        <p className="context-note">Alle erfassten normalen Einzelspiele dieser Saison. Baker-Ergebnisse werden als Mannschaftswert erfasst.</p>
      </div>
    </dialog>
  </>;
}
