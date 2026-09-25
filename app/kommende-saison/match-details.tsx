import { teamName } from "@/lib/next-season";
import type { Baker, Score } from "@/lib/next-standings";

const format=(value:number|null)=>value===null?"–":value.toLocaleString("de-DE");

export function MatchDetails({day,left,right,scores,bakers}:{day:number;left:number;right:number;scores:Score[];bakers:Baker[]}){
  if(left===0||right===0)return null;
  const teams=[left,right].map(id=>{
    const players=scores.filter(row=>row.day===day&&row.team_id===id&&[row.game_1,row.game_2,row.game_3].some(n=>n!==null)).sort((a,b)=>a.slot-b.slot);
    const baker=bakers.find(row=>row.day===day&&row.team_id===id);
    const bakerGames=baker?[baker.game_1,baker.game_2,baker.game_3]:[null,null,null];
    return {id,players,bakerGames,hasBaker:bakerGames.some(n=>n!==null)};
  });
  if(!teams.some(team=>team.players.length||team.hasBaker))return null;
  return <details className="match-details"><summary>Einzelspielergebnisse ansehen</summary><div className="match-details-content">{teams.map(team=><section key={team.id} aria-label={`Ergebnisse ${teamName(team.id)}`}><h3>{teamName(team.id)}</h3>{team.players.length?<div className="match-details-scroll"><table><thead><tr><th>Spieler</th><th>Spiel 1</th><th>Spiel 2</th><th>Spiel 3</th><th>Summe</th></tr></thead><tbody>{team.players.map(row=>{const games=[row.game_1,row.game_2,row.game_3];return <tr key={row.slot}><td>{row.name}</td>{games.map((n,i)=><td key={i}>{format(n)}</td>)}<td>{games.reduce<number>((n,value)=>n+(value??0),0).toLocaleString("de-DE")}</td></tr>})}</tbody></table></div>:<p>Noch keine Einzelspielergebnisse.</p>}{team.hasBaker&&<p className="match-baker"><strong>Baker:</strong> {team.bakerGames.map((n,i)=>`Spiel ${i+1}: ${format(n)}`).join(" · ")}</p>}</section>)}</div></details>;
}
