"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate } from "@/lib/types";
import Leaderboard from "@/components/Leaderboard";

export default function DashboardPage() {
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

  const totalInPipeline = candidates.length;
  const totalRnf = candidates.filter((c) => c.rnf).length;

  return (
    <div className="pt-10">
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">Total Candidates</p>
          <p className="hero-title text-4xl mt-1">{totalInPipeline}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">RNF Achieved</p>
          <p className="hero-title text-4xl mt-1 text-good">{totalRnf}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">Conversion Rate</p>
          <p className="hero-title text-4xl mt-1 text-gold">
            {totalInPipeline > 0 ? Math.round((totalRnf / totalInPipeline) * 100) : 0}%
          </p>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-slate">Loading standings...</p>
      ) : (
        <Leaderboard candidates={candidates} />
      )}
    </div>
  );
}
