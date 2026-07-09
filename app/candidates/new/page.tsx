"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LEADERS, EVENTS } from "@/lib/constants";

export default function NewCandidatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [leader, setLeader] = useState<string>(LEADERS[0]);
  const [events, setEvents] = useState<string[]>([]);
  const [paperM9, setPaperM9] = useState(false);
  const [paperM9a, setPaperM9a] = useState(false);
  const [paperRes5, setPaperRes5] = useState(false);
  const [paperHi, setPaperHi] = useState(false);
  const [foundationTraining, setFoundationTraining] = useState(false);
  const [rnf, setRnf] = useState(false);
  const [notes, setNotes] = useState("");

  function toggleEvent(ev: string) {
    setEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Candidate name is required.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase.from("candidates").insert([
      {
        name: name.trim(),
        age: age ? parseInt(age, 10) : null,
        school: school.trim() || null,
        course: course.trim() || null,
        leader,
        events,
        paper_m9: paperM9,
        paper_m9a: paperM9a,
        paper_res5: paperRes5,
        paper_hi: paperHi,
        foundation_training: foundationTraining,
        rnf,
        notes: notes.trim() || null,
      },
    ]);

    setSaving(false);

    if (error) {
      setErrorMsg("Could not save candidate: " + error.message);
      return;
    }

    router.push("/candidates");
  }

  const checkboxRow = "flex items-center gap-2 font-mono text-sm";

  return (
    <div className="pt-10 max-w-2xl">
      <p className="label text-gold mb-1">Log a new candidate</p>
      <h2 className="hero-title text-3xl mb-8">Add Candidate</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label text-slate block mb-1">Leader</label>
          <select
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
            className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
          >
            {LEADERS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label text-slate block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
              placeholder="Candidate's full name"
            />
          </div>
          <div>
            <label className="label text-slate block mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
              placeholder="e.g. 24"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label text-slate block mb-1">School</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
              placeholder="e.g. NUS"
            />
          </div>
          <div>
            <label className="label text-slate block mb-1">Course</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
              placeholder="e.g. Business Analytics"
            />
          </div>
        </div>

        <div>
          <label className="label text-slate block mb-2">Events Attended</label>
          <div className="grid grid-cols-2 gap-y-2">
            {EVENTS.map((ev) => (
              <label key={ev} className={checkboxRow}>
                <input
                  type="checkbox"
                  checked={events.includes(ev)}
                  onChange={() => toggleEvent(ev)}
                />
                {ev}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label text-slate block mb-2">Papers Completed</label>
          <div className="grid grid-cols-2 gap-y-2">
            <label className={checkboxRow}>
              <input type="checkbox" checked={paperM9} onChange={(e) => setPaperM9(e.target.checked)} />
              M9
            </label>
            <label className={checkboxRow}>
              <input type="checkbox" checked={paperM9a} onChange={(e) => setPaperM9a(e.target.checked)} />
              M9a
            </label>
            <label className={checkboxRow}>
              <input type="checkbox" checked={paperRes5} onChange={(e) => setPaperRes5(e.target.checked)} />
              RES5
            </label>
            <label className={checkboxRow}>
              <input type="checkbox" checked={paperHi} onChange={(e) => setPaperHi(e.target.checked)} />
              HI
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2">
          <label className={checkboxRow}>
            <input
              type="checkbox"
              checked={foundationTraining}
              onChange={(e) => setFoundationTraining(e.target.checked)}
            />
            Foundation Training Completed
          </label>
          <label className={checkboxRow}>
            <input type="checkbox" checked={rnf} onChange={(e) => setRnf(e.target.checked)} />
            RNF (Licensed)
          </label>
        </div>

        <div>
          <label className="label text-slate block mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            placeholder="Follow-up notes, concerns, next steps..."
          />
        </div>

        {errorMsg && <p className="font-mono text-sm text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          disabled={saving}
          className="label bg-ink text-cream px-6 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Candidate"}
        </button>
      </form>
    </div>
  );
}
