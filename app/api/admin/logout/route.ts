import { NextRequest,NextResponse } from "next/server";
import { cookieName,validOrigin } from "@/lib/admin-auth";
export async function POST(request:NextRequest){if(!validOrigin(request))return NextResponse.json({error:"Ungültige Anfrage."},{status:403});const response=NextResponse.json({ok:true});response.cookies.set(cookieName,"",{path:"/",maxAge:0});return response;}
