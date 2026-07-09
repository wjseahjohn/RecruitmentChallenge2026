export const LEADERS = [
  "John",
  "Angie",
  "Shiguan",
  "Xunqin",
  "Jing Yi",
  "Christin",
  "Melvin",
  "Reyna",
  "Eslyn",
] as const;

export type Leader = (typeof LEADERS)[number];

export const EVENTS = [
  "Founders Night",
  "Entre Forum",
  "Team Meeting",
  "TLDR",
  "Division Meeting",
  "Team Outing",
] as const;

export type EventName = (typeof EVENTS)[number];

export const PAPERS = ["M9", "M9a", "RES5", "HI"] as const;

export type Paper = (typeof PAPERS)[number];

// Ordered pipeline stages used to compute a candidate's overall progress.
// Each stage is worth an equal share of the progress bar.
export const STAGE_KEYS = [
  "has_started",
  "paper_m9",
  "paper_m9a",
  "paper_res5",
  "paper_hi",
  "foundation_training",
  "rnf",
] as const;

export function stageLabel(key: string): string {
  const map: Record<string, string> = {
    has_started: "Exploration",
    paper_m9: "M9",
    paper_m9a: "M9a",
    paper_res5: "RES5",
    paper_hi: "HI",
    foundation_training: "Foundation Training",
    rnf: "RNF",
  };
  return map[key] || key;
}
