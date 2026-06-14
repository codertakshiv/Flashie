import Link from "next/link";
import { Zap, MessageCircle, AlertCircle } from "lucide-react";
import GitHubIcon from "@/components/GitHubIcon";

export default function Footer() {
  return (
    <footer className="border-t border-border" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sm mb-3" aria-label="Flashie home">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-brand-foreground">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <span>Flashie</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-48">
              Browser-based firmware flashing platform. Flash your boards directly from Chrome or Edge.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-1.5">
              <li><Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Projects</Link></li>
              <li><Link href="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Documentation</Link></li>
              <li><Link href="/manage" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Manage</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Support</h4>
            <ul className="space-y-1.5">
              <li><Link href="/troubleshooting" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Troubleshooting</Link></li>
              <li><Link href="/docs#faq" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">FAQ</Link></li>
              <li><Link href="/docs#browser-compatibility" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Browser Compatibility</Link></li>
              <li><Link href="/verify" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">Verification Checklist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Community</h4>
            <ul className="space-y-1.5">
              <li><a href="https://github.com/flashie/flashie" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"><GitHubIcon className="h-3.5 w-3.5" />GitHub</a></li>
              <li><a href="https://github.com/flashie/flashie/discussions" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />Discussions</a></li>
              <li><a href="https://github.com/flashie/flashie/issues" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />Report Issue</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 flex flex-col items-center justify-between gap-1 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Flashie &mdash; Open source firmware flashing platform.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js &middot; Powered by Web Serial &amp; ESP Web Tools
          </p>
        </div>
      </div>
    </footer>
  );
}
