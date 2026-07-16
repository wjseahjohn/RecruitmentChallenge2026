"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LEADERS } from "@/lib/constants";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

export default function NewDeparturePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [leader, setLeader] = useState<string>(LEADERS[0]);
  const [dateLeft, setDateLeft] = useState(todayISO());
  const [reason, setReason] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Name is required.");
      return;
    }
    setSaving(true);
    setErrorMsg("");

    const { error } = await supabase.from("departures").insert([
      {
        name: name.trim(),
        leader,
        date_left: dateLeft,
        reason: reason.trim() || null,
      },
    ]);

    setSaving(false);

    if (error) {
      setErrorMsg("Could not save: " + error.message);
      return;
    }

    router.push("/departures");
  }

  return (
    <div className="pt-10 max-w-2xl">
      <p className="label text-gold mb-1">Log an attrition record</p>
      <h2 className="hero-title text-3xl mb-8">Associate Left</h2>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-slate block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
              placeholder="Associate's full name"
            />
          </div>
          <div>
            <label className="label text-slate block mb-1">Date Left</label>
            <input
              type="date"
              value={dateLeft}
              onChange={(e) => setDateLeft(e.target.value)}
              className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="label text-slate block mb-1">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full font-mono text-sm px-3 py-2 border border-ink/15 rounded-sm bg-white"
            placeholder="Why they left, if known..."
          />
        </div>

        {errorMsg && <p className="font-mono text-sm text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          disabled={saving}
          className="label bg-ink text-cream px-6 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Departure"}
        </button>
      </form>
    </div>
  );
}
