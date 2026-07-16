export interface Candidate {
  id: string;
  name: string;
  age: number | null;
  school: string | null;
  course: string | null;
  leader: string;
  events: string[];
  paper_m9: boolean;
  paper_m9a: boolean;
  paper_res5: boolean;
  paper_hi: boolean;
  foundation_training: boolean;
  rnf: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CandidateInput = Omit<Candidate, "id" | "created_at" | "updated_at">;

export function computeProgress(c: Candidate): number {
  const stages = [
    true, // exploration is implicit once a candidate exists
    c.paper_m9,
    c.paper_m9a,
    c.paper_res5,
    c.paper_hi,
    c.foundation_training,
    c.rnf,
  ];
  const done = stages.filter(Boolean).length;
  return Math.round((done / stages.length) * 100);
}

export interface Departure {
  id: string;
  name: string;
  leader: string;
  date_left: string;
  reason: string | null;
  created_at: string;
}
