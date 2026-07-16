"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate, Departure } from "@/lib/types";
import Leaderboard from "@/components/Leaderboard";

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [candidatesRes, departuresRes] = await Promise.all([
        supabase.from("candidates").select("*").order("created_at", { ascending: false }),
        supabase.from("departures").select("*").order("date_left", { ascending: false }),
      ]);
      if (!candidatesRes.error && candidatesRes.data) {
        setCandidates(candidatesRes.data as Candidate[]);
      }
      if (!departuresRes.error && departuresRes.data) {
        setDepartures(departuresRes.data as Departure[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const totalInPipeline = candidates.length;
  const totalRnf = candidates.filter((c) => c.rnf).length;
  const totalDepartures = departures.length;
  const netGrowth = totalRnf - totalDepartures;

  return (
    <div className="pt-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">Total Candidates</p>
          <p className="hero-title text-4xl mt-1">{totalInPipeline}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">RNF Achieved</p>
          <p className="hero-title text-4xl mt-1 text-good">{totalRnf}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">Attrition</p>
          <p className="hero-title text-4xl mt-1 text-red-500">{totalDepartures}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-sm px-5 py-4">
          <p className="label text-slate">Net Growth</p>
          <p className="hero-title text-4xl mt-1 text-gold">
            {netGrowth >= 0 ? "+" + netGrowth : netGrowth}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-slate">Loading standings...</p>
      ) : (
        <Leaderboard candidates={candidates} departures={departures} />
      )}
    </div>
  );
}
