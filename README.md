# Hausliga Oberberg · Saison 2026/2027

Next.js app for Vercel. `/` shows both public group tables. `/kommende-saison` shows fixtures, `/bestenliste` records and player totals, `/archiv/2025-26` the historical season. `/eingabe` requires the league password and saves results.

## Deployment

1. Run `supabase/schema.sql` once in your Supabase SQL editor. The table has RLS enabled and no anonymous policy.
2. Configure the four variables from `.env.example` in Vercel for Production. Use a unique password (at least 12 characters) and a random AUTH_SECRET (at least 32 characters). The Supabase secret key must only be configured server side.
3. Deploy as a Next.js project. The build command is `pnpm build` and install command is `pnpm install --frozen-lockfile`.

The 2025/26 archive is based on the included Excel-derived snapshot. Existing edits in the prior Sites database are not transferred automatically. The 2026/27 database begins empty until results are entered.
# Finale 2026/2027

Die öffentliche Seite `/finale` zeigt die drei punktbesten Teams jeder Gruppe und nach fünf Finalspielen die Plätze nach Gesamtpins. Pin-Gleichstände werden durch zusätzliche Stechrunden entschieden. Die Eingabe ist mit derselben Admin-Anmeldung wie die Ligaspieltage geschützt.

Vor der Veröffentlichung der Finalseite den ergänzten Block in `supabase/schema.sql` im SQL-Editor des bestehenden Supabase-Projekts ausführen. Er legt `hausliga_final_results` mit aktivierter Row Level Security an; die laufenden Ligadaten werden nicht verändert.
