"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Candidate, progressFraction } from "@/lib/types";
import { LEADERS } from "@/lib/constants";
import StageBar from "@/components/StageBar";

type SortMode = "progress" | "recent";

export default function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  const [leaderFilter, setLeaderFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("progress");

  const filtered = useMemo(() => {
    const result = candidates.filter((c) => {
      if (leaderFilter !== "All" && c.leader !== leaderFilter) return false;
      if (statusFilter === "RNF" && !c.rnf) return false;
      if (statusFilter === "In Progress" && c.rnf) return false;
      if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (sortMode === "progress") {
      return [...result].sort((a, b) => {
        const diff = progressFraction(b) - progressFraction(a);
        if (diff !== 0) return diff;
        // Tie-break: most recently updated first
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
    }

    return [...result].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [candidates, leaderFilter, statusFilter, search, sortMode]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
        />
        <select
          value={leaderFilter}
          onChange={(e) => setLeaderFilter(e.target.value)}
          className="font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
        >
          <option value="All">All Leaders</option>
          {LEADERS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="RNF">RNF</option>
        </select>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
        >
          <option value="progress">Furthest Progress First</option>
          <option value="recent">Recently Added First</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-slate font-mono text-sm py-8 text-center">
            No candidates match these filters.
          </p>
        )}
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={"/candidates/" + c.id}
            className="block bg-white border border-ink/10 rounded-sm px-5 py-4 hover:border-gold transition-colors"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <p className="hero-title text-xl">{c.name}</p>
                  <p className="label text-slate">{c.leader}</p>
                </div>
                <p className="text-sm text-slate">
                  {c.school || "\u2014"}{c.course ? ", " + c.course : ""}
                </p>
              </div>
              <div className="w-56">
                <StageBar candidate={c} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
