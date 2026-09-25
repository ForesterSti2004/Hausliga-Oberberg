export const groups = [
  ["Bowlkommando", "Split Kings", "Team Unfug", "Pinschubser", "Pin Crusher"],
  ["Glücksritter", "Geobowl", "Eightball", "Hilos", "Highlander Oberberg", "4 Teufel"],
];
export const seasonName = "Saison 2026/2027";
export const roundCount = 10;

export function scheduleDate(day:number,group:number):string {
  const secondLeg=day>5;
  const start=secondLeg?Date.UTC(2027,0,12):Date.UTC(2026,8,29);
  const weeks=(secondLeg?day-6:day-1)*2+(group-1);
  return new Date(start+weeks*7*24*60*60*1000).toISOString().slice(0,10);
}

export const teamIds = (group: number) => groups[group - 1].map((_, index) => (group - 1) * 5 + index + 1);
export const teamName = (id: number) => id ? groups[id <= 5 ? 0 : 1][id <= 5 ? id - 1 : id - 6] : "Freigegner";

export type Fixture = { day: number; group: number; lane: number; left: number; right: number };
export const fixtures: Fixture[] = groups.flatMap((_, groupIndex) => {
  let rotation = [0, 1, 2, 3, 4, 5];
  const result: Fixture[] = [];
  for (let day = 1; day <= 5; day++) {
    for (let lane = 1; lane <= 3; lane++) {
      const a = rotation[lane - 1], b = rotation[6 - lane];
      const left=a ? groupIndex * 5 + a : groupIndex === 1 ? 11 : 0;
      const right=b ? groupIndex * 5 + b : groupIndex === 1 ? 11 : 0;
      result.push({ day, group: groupIndex + 1, lane, left, right });
      result.push({ day:day+5, group: groupIndex + 1, lane, left:right, right:left });
    }
    rotation = [rotation[0], rotation[5], ...rotation.slice(1, 5)];
  }
  return result;
});
