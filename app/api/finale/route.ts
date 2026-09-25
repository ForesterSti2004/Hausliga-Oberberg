import { NextRequest, NextResponse } from "next/server";
import { authenticated, validOrigin } from "@/lib/admin-auth";
import { loadResults } from "@/lib/results-store";
import { loadFinalResults, saveFinalResult } from "@/lib/final-store";
import { qualifiers, type FinalResult } from "@/lib/final";

export const dynamic="force-dynamic";

export async function GET(){
  try{return NextResponse.json({results:await loadFinalResults()},{headers:{"Cache-Control":"no-store"}});}
  catch(error){console.error("Loading final results failed",error);return NextResponse.json({error:"Finalergebnisse gerade nicht erreichbar."},{status:503});}
}

export async function PUT(request:NextRequest){
  if(!authenticated(request))return NextResponse.json({error:"Bitte auf der Eingabeseite anmelden."},{status:401});
  if(!validOrigin(request))return NextResponse.json({error:"Ungültige Anfrage."},{status:403});
  try{
    const data=await request.json() as FinalResult;
    const validScore=(n:unknown)=>n===null||(Number.isInteger(n)&&Number(n)>=0&&Number(n)<=300);
    if(!data||!Number.isInteger(data.team_id)||data.team_id<1||data.team_id>10||!Array.isArray(data.rows)||data.rows.length!==5||new Set(data.rows.map(r=>r.slot)).size!==5||data.rows.some(r=>!Number.isInteger(r.slot)||r.slot<0||r.slot>4||typeof r.name!=="string"||r.name.length>80||typeof r.gender!=="string"||!["","m","w"].includes(r.gender)||!Array.isArray(r.games)||r.games.length!==5||!r.games.every(validScore)||(r.games.some(n=>n!==null)&&!r.name.trim()))||[0,1,2,3,4].some(i=>data.rows.filter(r=>r.games[i]!==null).length>3)||!Array.isArray(data.tiebreak)||data.tiebreak.length>20||!data.tiebreak.every(n=>n===null||(Number.isInteger(n)&&n>=0&&n<=900))){
      return NextResponse.json({error:"Je Spiel höchstens drei Spieler mit 0 bis 300 Pins eintragen. Stechen: 0 bis 900 Pins."},{status:400});
    }
    const stored=await loadResults();
    const scores=stored.flatMap(item=>item.rows.map(row=>({team_id:item.team_id,day:item.day,slot:row.slot,name:row.name,gender:row.gender,game_1:row.games[0],game_2:row.games[1],game_3:row.games[2]})));
    const baker=stored.map(item=>({team_id:item.team_id,day:item.day,game_1:item.baker[0],game_2:item.baker[1],game_3:item.baker[2]}));
    const group=data.team_id<=5?1:2;
    if(!qualifiers(group,scores,baker).some(t=>t.id===data.team_id))return NextResponse.json({error:"Diese Mannschaft steht aktuell nicht unter den ersten drei ihrer Gruppe."},{status:400});
    await saveFinalResult({...data,rows:data.rows.map(r=>({...r,name:r.name.trim()}))});
    return NextResponse.json({ok:true});
  }catch(error){console.error("Saving final results failed",error);return NextResponse.json({error:"Speichern fehlgeschlagen. Eingaben bleiben erhalten."},{status:503});}
}
