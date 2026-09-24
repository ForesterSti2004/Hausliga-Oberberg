import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export const cookieName = "hausliga_admin";
const lifetime = 12 * 60 * 60;
const secret = () => process.env.AUTH_SECRET;
export const authConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12 && secret() && secret()!.length >= 32);
const digest = (value:string) => createHash("sha256").update(value).digest();
const equal = (a:string,b:string) => timingSafeEqual(digest(a),digest(b));
export function passwordValid(password:string) { return authConfigured() && equal(password,process.env.ADMIN_PASSWORD!); }
export function token() {
  const expiry = String(Math.floor(Date.now()/1000)+lifetime);
  const signature = createHmac("sha256",secret()!).update(expiry).digest("hex");
  return `${expiry}.${signature}`;
}
export function authenticated(request:NextRequest) {
  if (!authConfigured()) return false;
  const value=request.cookies.get(cookieName)?.value ?? "";
  const [expiry,signature,...rest]=value.split(".");
  if (rest.length || !/^\d{10}$/.test(expiry??"") || !/^[a-f0-9]{64}$/.test(signature??"") || Number(expiry)<Date.now()/1000) return false;
  const expected=createHmac("sha256",secret()!).update(expiry).digest("hex");
  return equal(signature,expected);
}
export const cookieOptions = {httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict" as const,path:"/",maxAge:lifetime};
export function validOrigin(request:NextRequest) { return request.headers.get("origin") === request.nextUrl.origin && request.headers.get("content-type")?.split(";")[0] === "application/json"; }
