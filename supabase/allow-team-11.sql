-- Apply to the existing 2026/27 database before recording results for 4 Teufel.
-- Existing results and final results remain untouched.
begin;

alter table public.hausliga_results
  drop constraint if exists hausliga_results_team_id_check;
alter table public.hausliga_results
  add constraint hausliga_results_team_id_check check (team_id between 1 and 11);

alter table public.hausliga_final_results
  drop constraint if exists hausliga_final_results_team_id_check;
alter table public.hausliga_final_results
  add constraint hausliga_final_results_team_id_check check (team_id between 1 and 11);

commit;
