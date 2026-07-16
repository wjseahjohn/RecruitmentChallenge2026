"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Departure } from "@/lib/types";
import { LEADERS } from "@/lib/constants";

export default function DeparturesPage() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderFilter, setLeaderFilter] = useState("All");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from("departures")
      .select("*")
      .order("date_left", { ascending: false });
    if (!error && data) setDepartures(data as Departure[]);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Remove this departure record? This cannot be undone."
    );
    if (!confirmed) return;
    const { error } = await supabase.from("departures").delete().eq("id", id);
    if (!error) setDepartures((prev) => prev.filter((d) => d.id !== id));
  }

  const filtered = useMemo(() => {
    if (leaderFilter === "All") return departures;
    return departures.filter((d) => d.leader === leaderFilter);
  }, [departures, leaderFilter]);

  return (
    <div className="pt-10">
      <p className="label text-gold mb-1">Associates who left</p>
      <h2 className="hero-title text-3xl mb-6">Attrition</h2>

      <div className="flex flex-wrap gap-3 mb-6">
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
      </div>

      {loading ? (
        <p className="font-mono text-sm text-slate">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate font-mono text-sm py-8 text-center">
          No departures logged{leaderFilter !== "All" ? " for " + leaderFilter : ""}.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-ink/10 rounded-sm px-5 py-4 flex items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <p className="hero-title text-xl">{d.name}</p>
                  <p className="label text-slate">{d.leader}</p>
                </div>
                <p className="text-sm text-slate">
                  Left {new Date(d.date_left).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {d.reason ? " \u2014 " + d.reason : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(d.id)}
                className="label text-red-600 hover:underline whitespace-nowrap"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
