import { NextRequest,NextResponse } from "next/server";
import { authConfigured,cookieName,cookieOptions,passwordValid,token,validOrigin } from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export async function POST(request:NextRequest) {
  if(!validOrigin(request))return NextResponse.json({error:"Ungültige Anfrage."},{status:403});
  if(!authConfigured())return NextResponse.json({error:"Eingabe noch nicht eingerichtet."},{status:503});
  const body=await request.json().catch(()=>null);
  if(!body || typeof body.password!=="string" || body.password.length>256 || !passwordValid(body.password))return NextResponse.json({error:"Passwort ungültig."},{status:401,headers:{"Cache-Control":"no-store"}});
  const response=NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
  response.cookies.set(cookieName,token(),cookieOptions);
  return response;
}
