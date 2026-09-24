import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({rows:[],canEdit:false},{headers:{"Cache-Control":"no-store"}});}
