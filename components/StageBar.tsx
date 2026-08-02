import { Candidate, progressFraction } from "@/lib/types";
import { stageLabel } from "@/lib/constants";

export default function StageBar({ candidate }: { candidate: Candidate }) {
  const segments: { key: string; done: boolean }[] = [
    { key: "has_started", done: true },
    { key: "paper_m9", done: candidate.paper_m9 },
    { key: "paper_m9a", done: candidate.paper_m9a },
    { key: "paper_res5", done: candidate.paper_res5 },
    { key: "paper_hi", done: candidate.paper_hi },
    { key: "foundation_training", done: candidate.foundation_training },
    { key: "rnf", done: candidate.rnf },
  ];

  const fraction = progressFraction(candidate);
  // As a candidate progresses further, completed segments get visually
  // richer (more opaque gold) rather than jumping straight from grey to
  // full color. RNF is the one milestone that switches to green.
  const goldOpacity = 0.35 + fraction * 0.65;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-[2px] w-full h-2.5">
        {segments.map((s, i) => {
          if (!s.done) {
            return <div key={i} className="flex-1 rounded-sm bg-stagegrey" title={stageLabel(s.key)} />;
          }
          if (candidate.rnf) {
            return (
              <div key={i} className="flex-1 rounded-sm bg-good" title={stageLabel(s.key)} />
            );
          }
          return (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gold"
              style={{ opacity: goldOpacity }}
              title={stageLabel(s.key)}
            />
          );
        })}
      </div>
      <p className="label text-[0.6rem] text-slate">
        {candidate.rnf
          ? "RNF complete"
          : candidate.foundation_training
          ? "Foundation Training done \u2014 awaiting RNF"
          : segments.filter((s) => s.done).length + " of " + segments.length + " stages"}
      </p>
    </div>
  );
}
