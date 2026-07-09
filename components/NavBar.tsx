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
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <p className="label text-gold">AAG Division</p>
          <h1 className="hero-title text-3xl font-semibold tracking-wide">
            TRC <span className="text-gold">/</span> The Recruitment Challenge
          </h1>
        </div>
        <nav className="flex gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            const base = "label px-4 py-2 rounded-sm border transition-colors";
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
