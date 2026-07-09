"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Candidate } from "@/lib/types";
import { LEADERS, EVENTS } from "@/lib/constants";
import StageBar from "@/components/StageBar";

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) setCandidate(data as Candidate);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  function update<K extends keyof Candidate>(key: K, value: Candidate[K]) {
    setCandidate((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function toggleEvent(ev: string) {
    if (!candidate) return;
    const exists = candidate.events.includes(ev);
    const next = exists
      ? candidate.events.filter((e) => e !== ev)
      : [...candidate.events, ev];
    update("events", next);
  }

  async function handleSave() {
    if (!candidate) return;
    setSaving(true);
    setErrorMsg("");
    const { error } = await supabase
      .from("candidates")
      .update({
        name: candidate.name,
        age: candidate.age,
        school: candidate.school,
        course: candidate.course,
        leader: candidate.leader,
        events: candidate.events,
        paper_m9: candidate.paper_m9,
        paper_m9a: candidate.paper_m9a,
        paper_res5: candidate.paper_res5,
        paper_hi: candidate.paper_hi,
        foundation_training: candidate.foundation_training,
        rnf: candidate.rnf,
        notes: candidate.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      setErrorMsg("Could not save changes: " + error.message);
      return;
    }
    router.push("/candidates");
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Remove this candidate from TRC? This cannot be undone."
    );
    if (!confirmed) return;
    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (!error) router.push("/candidates");
  }

  const checkboxRow = "flex items-center gap-2 font-mono text-sm";

  if (loading) return <p className="pt-10 font-mono text-sm text-slate">Loading...</p>;
  if (!candidate) return <p className="pt-10 font-mono text-sm text-slate">Candidate not found.</p>;

  return (
    <div className="pt-10 max-w-2xl">
      <p className="label text-gold mb-1">{candidate.leader}&rsquo;s candidate</p>
      <h2 className="hero-title text-3xl mb-4">{candidate.name}</h2>
      <div className="mb-8">
        <StageBar candidate={candidate} />
      </div>

      <div className="space-y-6">
        <div>
          <label className="label text-slate block mb-1">Leader</label>
          <select
            value={candidate.leader}
            onChange={(e) => update("leader", e.target.value)}
            className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
          >
            {LEADERS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-slate block mb-1">Name</label>
            <input
              type="text"
              value={candidate.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            />
          </div>
          <div>
            <label className="label text-slate block mb-1">Age</label>
            <input
              type="number"
              value={candidate.age ?? ""}
              onChange={(e) => update("age", e.target.value ? parseInt(e.target.value, 10) : null)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-slate block mb-1">School</label>
            <input
              type="text"
              value={candidate.school ?? ""}
              onChange={(e) => update("school", e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            />
          </div>
          <div>
            <label className="label text-slate block mb-1">Course</label>
            <input
              type="text"
              value={candidate.course ?? ""}
              onChange={(e) => update("course", e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="label text-slate block mb-2">Events Attended</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
            {EVENTS.map((ev) => (
              <label key={ev} className={checkboxRow}>
                <input
                  type="checkbox"
                  checked={candidate.events.includes(ev)}
                  onChange={() => toggleEvent(ev)}
                />
                {ev}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label text-slate block mb-2">Papers Completed</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
            <label className={checkboxRow}>
              <input
                type="checkbox"
                checked={candidate.paper_m9}
                onChange={(e) => update("paper_m9", e.target.checked)}
              />
              M9
            </label>
            <label className={checkboxRow}>
              <input
                type="checkbox"
                checked={candidate.paper_m9a}
                onChange={(e) => update("paper_m9a", e.target.checked)}
              />
              M9a
            </label>
            <label className={checkboxRow}>
              <input
                type="checkbox"
                checked={candidate.paper_res5}
                onChange={(e) => update("paper_res5", e.target.checked)}
              />
              RES5
            </label>
            <label className={checkboxRow}>
              <input
                type="checkbox"
                checked={candidate.paper_hi}
                onChange={(e) => update("paper_hi", e.target.checked)}
              />
              HI
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          <label className={checkboxRow}>
            <input
              type="checkbox"
              checked={candidate.foundation_training}
              onChange={(e) => update("foundation_training", e.target.checked)}
            />
            Foundation Training Completed
          </label>
          <label className={checkboxRow}>
            <input
              type="checkbox"
              checked={candidate.rnf}
              onChange={(e) => update("rnf", e.target.checked)}
            />
            RNF (Licensed)
          </label>
        </div>

        <div>
          <label className="label text-slate block mb-1">Notes</label>
          <textarea
            value={candidate.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
          />
        </div>

        {errorMsg && <p className="font-mono text-sm text-red-600">{errorMsg}</p>}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="label bg-ink text-cream px-6 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDelete}
            className="label px-6 py-3 rounded-sm border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
          >
            Remove Candidate
          </button>
        </div>
      </div>
    </div>
  );
}
