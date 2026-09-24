import { NextRequest, NextResponse } from "next/server";
import { fixtures,roundCount } from "@/lib/next-season";
import { authenticated, validOrigin } from "@/lib/admin-auth";
import { loadResults,saveResults } from "@/lib/results-store";

export const dynamic="force-dynamic";
type Input={teamId:number;day:number;rows:{slot:number;name:string;gender:string;games:(number|null)[]}[];baker:(number|null)[]};
const validGames=(v:unknown):v is (number|null)[]=>Array.isArray(v)&&v.length===3&&v.every(n=>n===null||(Number.isInteger(n)&&n>=0&&n<=300));

export async function GET(){
  try {
    const stored=await loadResults();
    return NextResponse.json({scores:stored.flatMap(item=>item.rows.map(row=>({team_id:item.team_id,day:item.day,slot:row.slot,name:row.name,gender:row.gender,game_1:row.games[0],game_2:row.games[1],game_3:row.games[2]}))),baker:stored.map(item=>({team_id:item.team_id,day:item.day,game_1:item.baker[0],game_2:item.baker[1],game_3:item.baker[2]})),canEdit:false},{headers:{"Cache-Control":"no-store"}});
  }catch(error){console.error("Loading results failed",error);return NextResponse.json({error:"Ergebnisse gerade nicht erreichbar."},{status:503});}
}

export async function PUT(request:NextRequest){
  if(!authenticated(request))return NextResponse.json({error:"Bitte auf der Eingabeseite anmelden."},{status:401});
  if(!validOrigin(request))return NextResponse.json({error:"Ungültige Anfrage."},{status:403});
  try{
    const body=await request.json() as Input;
    const playing=fixtures.some(f=>f.day===body.day && f.left!==0 && f.right!==0 && (f.left===body.teamId||f.right===body.teamId));
    if(!Number.isInteger(body.teamId)||body.teamId<1||body.teamId>10||!Number.isInteger(body.day)||body.day<1||body.day>roundCount||!playing||!Array.isArray(body.rows)||body.rows.length!==5||new Set(body.rows.map(r=>r.slot)).size!==5||body.rows.some(r=>!Number.isInteger(r.slot)||r.slot<0||r.slot>4||typeof r.name!=="string"||r.name.length>80||!["","m","w"].includes(r.gender)||!validGames(r.games)||(r.games.some(v=>v!==null)&&!r.name.trim()))||!validGames(body.baker)||[0,1,2].some(game=>body.rows.filter(r=>r.games[game]!==null).length>3))return NextResponse.json({error:"Mannschaft und Spieltag prüfen. Je Spiel höchstens drei Spieler und nur Pinzahlen von 0 bis 300 eintragen."},{status:400});
    await saveResults({team_id:body.teamId,day:body.day,rows:body.rows.map(r=>({...r,name:r.name.trim()})),baker:body.baker});
    return NextResponse.json({ok:true});
  }catch(error){console.error("Saving results failed",error);return NextResponse.json({error:"Speichern fehlgeschlagen. Eingaben bleiben erhalten."},{status:503});}
}
