import { fixtures, teamName } from "./next-season";
import { groupStandings, matchPoints, type Baker, type Score } from "./next-standings";

export type FinalRow = { slot:number; name:string; gender:string; games:(number|null)[] };
export type FinalResult = { team_id:number; rows:FinalRow[]; tiebreak:(number|null)[] };

export function qualifiers(group:number,scores:Score[],bakers:Baker[]) {
  return groupStandings(group,scores,bakers).slice(0,3);
}

export function seasonComplete(group:number,scores:Score[],bakers:Baker[]) {
  return fixtures.filter(f=>f.group===group&&f.left!==0&&f.right!==0)
    .every(f=>matchPoints(f.left,f.right,f.day,scores,bakers).complete);
}

export function finalStandings(group:number,scores:Score[],bakers:Baker[],results:FinalResult[]) {
  const ranked=qualifiers(group,scores,bakers).map(team=>{
    const record=results.find(r=>r.team_id===team.id);
    const games=Array.from({length:5},(_,i)=>{
      const values=record?.rows.map(r=>r.games[i]).filter((v):v is number=>v!==null)??[];
      return {pins:values.reduce((a,b)=>a+b,0),complete:values.length===3};
    });
    return {id:team.id,name:teamName(team.id),games,pins:games.reduce((n,g)=>n+g.pins,0),complete:games.every(g=>g.complete),tiebreak:record?.tiebreak??[]};
  });
  ranked.sort((a,b)=>{
    if(a.complete!==b.complete)return a.complete?-1:1;
    if(!a.complete&&!b.complete)return a.id-b.id;
    if(a.pins!==b.pins)return b.pins-a.pins;
    for(let i=0;i<Math.max(a.tiebreak.length,b.tiebreak.length);i++){
      const av=a.tiebreak[i],bv=b.tiebreak[i];
      if(av===null||av===undefined||bv===null||bv===undefined)break;
      if(av!==bv)return bv-av;
    }
    return a.id-b.id;
  });
  return ranked.map((team,index)=>{
    const prior=ranked[index-1];
    const compare=(other:typeof team)=>{
      if(!team.complete||!other.complete||team.pins!==other.pins)return false;
      const n=Math.max(team.tiebreak.length,other.tiebreak.length);
      return !n||Array.from({length:n},(_,i)=>team.tiebreak[i]===null||team.tiebreak[i]===undefined||other.tiebreak[i]===null||other.tiebreak[i]===undefined||team.tiebreak[i]===other.tiebreak[i]).every(Boolean);
    };
    return {...team,rank:team.complete?(prior&&compare(prior)?null:index+1):null,needsTiebreak:ranked.some(other=>other.id!==team.id&&compare(other))};
  });
}
