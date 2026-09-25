import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieName, validSession } from "@/lib/admin-auth";
import Finale from "@/components/finale-view";

export default async function FinaleEingabe(){
  if (!validSession((await cookies()).get(cookieName)?.value)) redirect("/eingabe");
  return <Finale editing />;
}
