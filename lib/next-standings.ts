import { fixtures, roundCount, teamIds } from "./next-season";

export type Score = {team_id:number;day:number;slot:number;name:string;gender:string;game_1:number|null;game_2:number|null;game_3:number|null};
export type Baker = {team_id:number;day:number;game_1:number|null;game_2:number|null;game_3:number|null};
type Game = { pins:number; complete:boolean };
export type MatchPoints = { left:number; right:number; regular:[number,number]; baker:[number,number]; bonus:[number,number]; complete:boolean };

function teamGames(id:number,day:number,scores:Score[],bakers:Baker[]):Game[] {
  if (id===0) return Array.from({length:6},()=>({pins:0,complete:true}));
  const rows=scores.filter(r=>r.team_id===id&&r.day===day);
  const b=bakers.find(r=>r.team_id===id&&r.day===day);
  const singles=(["game_1","game_2","game_3"] as const).map(key=>{
    const values=rows.map(r=>r[key]).filter((n):n is number=>n!==null);
    return {pins:values.reduce((a,n)=>a+n,0),complete:values.length===3};
  });
  const baker=(["game_1","game_2","game_3"] as const).map(key=>({pins:b?.[key]??0,complete:b?.[key]!==null&&b?.[key]!==undefined}));
  return [...singles,...baker];
}

export function matchPoints(leftId:number,rightId:number,day:number,scores:Score[],bakers:Baker[]):MatchPoints {
  const left=teamGames(leftId,day,scores,bakers),right=teamGames(rightId,day,scores,bakers);
  const regular:[number,number]=[0,0],baker:[number,number]=[0,0],bonus:[number,number]=[0,0];
  for(let i=0;i<6;i++) {
    if(!left[i].complete||!right[i].complete)continue;
    const target=i<3?regular:baker;
    if(left[i].pins>right[i].pins)target[0]+=2;
    else if(left[i].pins<right[i].pins)target[1]+=2;
    else {target[0]++;target[1]++;}
  }
  const complete=left.every(g=>g.complete)&&right.every(g=>g.complete);
  if(complete) {
    const l=left.reduce((n,g)=>n+g.pins,0),r=right.reduce((n,g)=>n+g.pins,0);
    if(l>r)bonus[0]=2;
    else if(l<r)bonus[1]=2;
    else {bonus[0]=1;bonus[1]=1;}
  }
  // A bye is a zero-pin, zero-point placeholder even if the recorded score ties it.
  if(leftId===0){regular[0]=0;baker[0]=0;bonus[0]=0;}
  if(rightId===0){regular[1]=0;baker[1]=0;bonus[1]=0;}
  return {left:regular[0]+baker[0]+bonus[0],right:regular[1]+baker[1]+bonus[1],regular,baker,bonus,complete};
}

export function groupStandings(group:number,scores:Score[],bakers:Baker[]) {
  return teamIds(group).map(id=>{
    const matches=fixtures.filter(f=>f.group===group&&(f.left===id||f.right===id));
    const points=matches.reduce((total,f)=>{
      const p=matchPoints(f.left,f.right,f.day,scores,bakers);
      return total+(f.left===id?p.left:p.right);
    },0);
    const games=Array.from({length:roundCount},(_,day)=>teamGames(id,day+1,scores,bakers)).flat().filter(g=>g.complete);
    const pins=games.reduce((total,g)=>total+g.pins,0);
    const completed=matches.filter(f=>matchPoints(f.left,f.right,f.day,scores,bakers).complete).length;
    return {id,points,pins,games:games.length,completed};
  }).sort((a,b)=>b.points-a.points||b.pins-a.pins||a.id-b.id);
}
