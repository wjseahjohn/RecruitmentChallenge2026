"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Leaderboard" },
    { href: "/candidates", label: "All Candidates" },
    { href: "/candidates/new", label: "+ New Candidate" },
  ];

  return (
    <header className="bg-ink text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label text-gold">John Seah Division</p>
          <h1 className="hero-title text-2xl sm:text-3xl font-semibold tracking-wide leading-tight">
            TRC <span className="text-gold">/</span> The Recruitment Challenge
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            const base =
              "label px-3 py-2 sm:px-4 rounded-sm border transition-colors text-[0.65rem] sm:text-[0.7rem] whitespace-nowrap";
            const activeClasses = active
              ? " bg-gold text-ink border-gold"
              : " border-cream/20 text-cream/80 hover:border-gold hover:text-gold";
            return (
              <Link key={link.href} href={link.href} className={base + activeClasses}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
