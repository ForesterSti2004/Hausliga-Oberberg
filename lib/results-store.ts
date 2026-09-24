type Stored = {team_id:number;day:number;rows:{slot:number;name:string;gender:string;games:(number|null)[]}[];baker:(number|null)[]};
function settings() {
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw Error("Ergebnisdatenbank nicht konfiguriert.");
  return {url:`${url.replace(/\/$/,"")}/rest/v1/hausliga_results`,key};
}
async function call(query:string, options:RequestInit={}) {
  const {url,key}=settings();
  const response=await fetch(url+query,{...options,headers:{apikey:key,...(key.startsWith("sb_secret_")?{}:{Authorization:`Bearer ${key}`}),...options.headers},cache:"no-store"});
  if(!response.ok) { console.error("Database request failed",response.status,await response.text()); throw Error("Ergebnisse gerade nicht erreichbar."); }
  return response;
}
export async function loadResults():Promise<Stored[]> {return await (await call("?select=team_id,day,rows,baker&order=day.asc,team_id.asc")).json() as Stored[];}
export async function saveResults(result:Stored) {await call("?on_conflict=team_id,day",{method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(result)});}
