import { fixtures } from "./next-season";
import { matchPoints, type Score, type Baker } from "./next-standings";

const keys=["game_1","game_2","game_3"] as const;

export function teamHistory(teamId:number,scores:Score[],bakers:Baker[]) {
  return fixtures.filter(f=>f.left===teamId||f.right===teamId).sort((a,b)=>a.day-b.day).flatMap(f=>{
    const players=scores.filter(row=>row.team_id===teamId&&row.day===f.day);
    const baker=bakers.find(row=>row.team_id===teamId&&row.day===f.day);
    const regular=keys.map(key=>{
      const values=players.map(row=>row[key]).filter((n):n is number=>n!==null);
      return {pins:values.length?values.reduce((sum,n)=>sum+n,0):null,complete:values.length===3};
    });
    const games=[...regular,...keys.map(key=>({pins:baker?.[key]??null,complete:baker?.[key]!==null&&baker?.[key]!==undefined}))];
    if(games.every(game=>game.pins===null))return [];
    const points=matchPoints(f.left,f.right,f.day,scores,bakers);
    return [{day:f.day,group:f.group,opponent:f.left===teamId?f.right:f.left,games,pins:games.reduce((sum,game)=>sum+(game.pins??0),0),complete:games.every(game=>game.complete),points:f.left===teamId?points.left:points.right}];
  });
}
