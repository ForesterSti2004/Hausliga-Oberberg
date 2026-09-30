import { teamName } from "./next-season";
import type { Score } from "./next-standings";

export type PlayerTotal = { key:string; name:string; team:string; teamId:number; games:number; pins:number; average:number };

export const playerKey = (teamId:number,name:string) => `${teamId}:${name.trim().replace(/\s+/g," ").normalize("NFKC").toLocaleLowerCase("de-DE")}`;

export function playerHistory(scores:Score[],teamId:number,name:string):Score[] {
  const key=playerKey(teamId,name);
  return scores.filter(row=>playerKey(row.team_id,row.name)===key&&[row.game_1,row.game_2,row.game_3].some(n=>n!==null)).sort((a,b)=>a.day-b.day||a.slot-b.slot);
}

export function playerTotals(scores:Score[]):PlayerTotal[] {
  const players=new Map<string,PlayerTotal>();
  for(const row of scores) {
    const name=row.name.trim().replace(/\s+/g," ");
    if(!name)continue;
    const values=[row.game_1,row.game_2,row.game_3].filter((n):n is number=>n!==null);
    if(!values.length)continue;
    const key=playerKey(row.team_id,name);
    const existing=players.get(key)??{key,name,team:teamName(row.team_id),teamId:row.team_id,games:0,pins:0,average:0};
    existing.games+=values.length;
    existing.pins+=values.reduce((sum,n)=>sum+n,0);
    existing.average=existing.pins/existing.games;
    players.set(key,existing);
  }
  return [...players.values()].sort((a,b)=>b.pins-a.pins||b.average-a.average||a.name.localeCompare(b.name,"de"));
}
