# TRC — The Recruitment Challenge

A recruitment tracker for your Division's leaders. Every leader logs their own
candidates as they move from exploration to RNF (licensed). A leaderboard
shows who's recruited the most, ranked both by total candidates in the
pipeline and by RNF count.

## What's inside

- **Leaderboard** (`/`) — podium for the top 3 by pipeline count, full
  standings table showing both pipeline total and RNF count per leader, plus
  overall stats (total candidates, total RNF, conversion rate).
- **All Candidates** (`/candidates`) — every candidate from every leader,
  filterable by leader and status, searchable by name. Each row shows a
  stage bar (Exploration → M9 → M9a → RES5 → HI → Foundation Training → RNF).
- **Add Candidate** (`/candidates/new`) — leader picks their name from a
  dropdown (no login required, per your call), fills in the candidate's
  details, events attended, papers, and status.
- **Candidate Detail** (`/candidates/[id]`) — view and edit any candidate,
  or remove them.

Since there's no login, anyone with the link can add, edit, or remove any
candidate — this matches "everyone sees all candidates" for full team
transparency and friendly competition.

## Setup

### 1. Create the Supabase table

In your Supabase project, open the SQL Editor and run the contents of
`supabase-schema.sql`. This creates the `candidates` table and opens it up
for public read/write (no login = anon key needs full access).

### 2. Environment variables

In Vercel, add:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both are found in Supabase under Project Settings → API.

### 3. Deploy

Push this project to GitHub (your usual pencil-icon + paste workflow), then
import it into Vercel. It will auto-deploy on every commit.

## Notes on the data model

- `events` is stored as a text array so a candidate can have attended any
  combination of Founders Night, Entre Forum, Team Meeting, TLDR, Division
  Meeting, and Team Outing.
- The stage bar treats "Exploration" as always complete once a candidate
  exists, then M9, M9a, RES5, HI, Foundation Training, and RNF each as their
  own segment — so at a glance you can see exactly where someone is stuck.
- If you later want to lock editing so leaders can only touch their own
  candidates, that would mean adding real login (Supabase Auth) and RLS
  policies keyed to each leader's account — happy to add that later if the
  honour-system approach ever becomes a problem.
