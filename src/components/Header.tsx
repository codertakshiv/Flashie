"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Projects" },
  { href: "/docs", label: "Docs" },
  { href: "/troubleshooting", label: "Help" },
  { href: "/manage", label: "Manage" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm"
          aria-label="Flashie home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-brand-foreground">
            <Zap className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-foreground">Flashie</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
