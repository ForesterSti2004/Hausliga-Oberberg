import type { FinalResult } from "./final";

function settings(){
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw Error("Ergebnisdatenbank nicht konfiguriert.");
  return {url:`${url.replace(/\/$/,"")}/rest/v1/hausliga_final_results`,key};
}
async function call(query:string,options:RequestInit={}){
  const {url,key}=settings();
  const response=await fetch(url+query,{...options,headers:{apikey:key,...(key.startsWith("sb_secret_")?{}:{Authorization:`Bearer ${key}`}),...options.headers},cache:"no-store"});
  if(!response.ok){console.error("Final result database request failed",response.status,await response.text());throw Error("Finalergebnisse gerade nicht erreichbar.");}
  return response;
}
export async function loadFinalResults():Promise<FinalResult[]>{return await (await call("?select=team_id,rows,tiebreak&order=team_id.asc")).json() as FinalResult[];}
export async function saveFinalResult(result:FinalResult){await call("?on_conflict=team_id",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(result)});}
