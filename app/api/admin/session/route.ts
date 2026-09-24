import { NextRequest,NextResponse } from "next/server";
import { authenticated } from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){return NextResponse.json({canEdit:authenticated(request)},{headers:{"Cache-Control":"no-store"}});}
