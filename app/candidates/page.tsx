"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate } from "@/lib/types";
import CandidateTable from "@/components/CandidateTable";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setCandidates(data as Candidate[]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="pt-10">
      <p className="label text-gold mb-1">Every candidate, every leader</p>
      <h2 className="hero-title text-3xl mb-6">All Candidates</h2>
      {loading ? (
        <p className="font-mono text-sm text-slate">Loading candidates...</p>
      ) : (
        <CandidateTable candidates={candidates} />
      )}
    </div>
  );
}
