import { LEADERS } from "@/lib/constants";
import { Candidate, Departure } from "@/lib/types";

interface LeaderStats {
  leader: string;
  total: number;
  rnf: number;
  departures: number;
  net: number;
}

function buildStats(candidates: Candidate[], departures: Departure[]): LeaderStats[] {
  const stats: LeaderStats[] = LEADERS.map((leader) => ({
    leader,
    total: 0,
    rnf: 0,
    departures: 0,
    net: 0,
  }));

  for (const c of candidates) {
    const row = stats.find((s) => s.leader === c.leader);
    if (!row) continue;
    row.total += 1;
    if (c.rnf) row.rnf += 1;
  }

  for (const d of departures) {
    const row = stats.find((s) => s.leader === d.leader);
    if (!row) continue;
    row.departures += 1;
  }

  for (const row of stats) {
    row.net = row.rnf - row.departures;
  }

  return stats;
}

export default function Leaderboard({
  candidates,
  departures,
}: {
  candidates: Candidate[];
  departures: Departure[];
}) {
  const stats = buildStats(candidates, departures);
  const byNet = [...stats].sort((a, b) => b.net - a.net || b.rnf - a.rnf);
  const podium = byNet.slice(0, 3);
  const rest = byNet.slice(3);

  const podiumOrder = [1, 0, 2]; // center the #1 spot visually

  return (
    <div className="space-y-10">
      <div>
        <p className="label text-slate mb-4">Ranked by net growth (RNF minus attrition)</p>
        <div className="grid grid-cols-3 gap-4 items-end">
          {podiumOrder.map((idx, position) => {
            const entry = podium[idx];
            if (!entry) return <div key={idx} />;
            const place = idx + 1;
            const heights = ["h-40", "h-52", "h-32"];
            const heightClass = heights[position];
            return (
              <div key={entry.leader} className="flex flex-col items-center">
                <p className="hero-title text-2xl mb-1">{entry.leader}</p>
                <p className="label text-slate mb-2 text-center">
                  Net {entry.net >= 0 ? "+" + entry.net : entry.net} &middot; {entry.rnf} RNF
                  &middot; {entry.departures} left
                </p>
                <div
                  className={
                    "w-full rounded-t-sm bg-ink flex items-start justify-center pt-3 " +
                    heightClass
                  }
                >
                  <span className="hero-title text-4xl text-gold">#{place}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label text-slate mb-3">Full standings</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[560px]">
            <thead>
              <tr className="label text-slate border-b border-ink/10">
                <th className="py-2 font-normal">Rank</th>
                <th className="py-2 font-normal">Leader</th>
                <th className="py-2 font-normal">In Pipeline</th>
                <th className="py-2 font-normal">RNF</th>
                <th className="py-2 font-normal">Attrition</th>
                <th className="py-2 font-normal">Net Growth</th>
              </tr>
            </thead>
            <tbody>
              {[...podium, ...rest].map((s, i) => (
                <tr key={s.leader} className="border-b border-ink/5">
                  <td className="py-2 font-mono text-sm text-slate">{i + 1}</td>
                  <td className="py-2 font-medium">{s.leader}</td>
                  <td className="py-2 font-mono">{s.total}</td>
                  <td className="py-2 font-mono text-good">{s.rnf}</td>
                  <td className="py-2 font-mono text-red-500">
                    {s.departures > 0 ? "-" + s.departures : "0"}
                  </td>
                  <td className="py-2 font-mono font-semibold">
                    {s.net >= 0 ? "+" + s.net : s.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
