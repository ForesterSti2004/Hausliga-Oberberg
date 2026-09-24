import { teamName, roundCount } from "./next-season";
import type { Score, Baker } from "./next-standings";

export type RecordEntry = { key:string; pins:number; name:string; team:string; day:number; game?:number };
type Board = { title:string; entries:RecordEntry[] };
const keys=["game_1","game_2","game_3"] as const;
const topThree=(entries:RecordEntry[])=>entries.sort((a,b)=>b.pins-a.pins||a.day-b.day||a.name.localeCompare(b.name,"de")).slice(0,3);

export function bestBoards(scores:Score[],bakers:Baker[]):Board[] {
  const teamGames:RecordEntry[]=[],men:RecordEntry[]=[],women:RecordEntry[]=[],teamDays:RecordEntry[]=[],bakerGames:RecordEntry[]=[],playerDays:RecordEntry[]=[];
  for(let teamId=1;teamId<=10;teamId++)for(let day=1;day<=roundCount;day++) {
    const rows=scores.filter(s=>s.team_id===teamId&&s.day===day);
    const baker=bakers.find(b=>b.team_id===teamId&&b.day===day);
    const normalValues:(number|null)[]=keys.map((key,game)=>{
      const numbers=rows.map(r=>r[key]).filter((n):n is number=>n!==null);
      if(numbers.length!==3)return null;
      const pins=numbers.reduce((sum,n)=>sum+n,0);
      teamGames.push({key:`team-${teamId}-${day}-${game}`,pins,name:teamName(teamId),team:teamName(teamId),day,game:game+1});
      return pins;
    });
    if(baker) keys.forEach((key,game)=>{
      const pins=baker[key];
      if(pins!==null)bakerGames.push({key:`baker-${teamId}-${day}-${game}`,pins,name:teamName(teamId),team:teamName(teamId),day,game:game+1});
    });
    if(normalValues.every((n):n is number=>n!==null)&&baker&&keys.every(key=>baker[key]!==null)) {
      const pins=normalValues.reduce<number>((sum,n)=>sum+(n??0),0)+keys.reduce((sum,key)=>sum+(baker[key]??0),0);
      teamDays.push({key:`team-day-${teamId}-${day}`,pins,name:teamName(teamId),team:teamName(teamId),day});
    }
    for(const row of rows) {
      if(!row.name.trim())continue;
      keys.forEach((key,game)=>{
        const pins=row[key];
        if(pins===null)return;
        const entry={key:`player-${teamId}-${day}-${row.slot}-${game}`,pins,name:row.name,team:teamName(teamId),day,game:game+1};
        if(row.gender==="m")men.push(entry);
        if(row.gender==="w")women.push(entry);
      });
      if(keys.every(key=>row[key]!==null))playerDays.push({key:`player-day-${teamId}-${day}-${row.slot}`,pins:keys.reduce((sum,key)=>sum+(row[key]??0),0),name:row.name,team:teamName(teamId),day});
    }
  }
  return [
    {title:"Höchstes Mannschaftsspiel",entries:topThree(teamGames)},
    {title:"Höchstes Einzelspiel Männer",entries:topThree(men)},
    {title:"Höchstes Einzelspiel Damen",entries:topThree(women)},
    {title:"Höchster Mannschaftsspieltag",entries:topThree(teamDays)},
    {title:"Höchstes Baker-Spiel",entries:topThree(bakerGames)},
    {title:"Höchster Einzelspieltag",entries:topThree(playerDays)},
  ];
}
