import { CheckCircle2, XCircle } from "lucide-react";

const checks = [
  {
    category: "Firmware & Manifest Verification",
    items: [
      "Navigate to each project's manifest.json URL in your browser — it should render valid JSON",
      "Verify all firmware file paths in manifests are relative (e.g. firmware/firmware.bin, not /projects/...)",
      "Check that every firmware file URL returns a 200 status and downloads correctly",
      "Confirm that all offsets use string format with double quotes (e.g. \"0x10000\")",
      "Verify that every manifest has at least one build entry with a valid chipFamily",
    ],
  },
  {
    category: "GitHub Pages Deployment",
    items: [
      "Run npm run build — verify it completes with no errors and outputs to the out/ directory",
      "Check that out/ contains all project manifest.json files in the correct paths",
      "Verify that out/index.html loads correctly when opened locally",
      "If using a basePath, verify that all asset URLs include the prefix",
      "Confirm trailingSlash: true produces correct paths (e.g. /docs/ instead of /docs)",
    ],
  },
  {
    category: "Browser Compatibility",
    items: [
      "Open the site in Google Chrome — the Flash Firmware buttons should be visible and clickable",
      "Open the site in Microsoft Edge — same behavior as Chrome",
      "Open the site in Firefox or Safari — verify the 'Browser not supported' message appears on flash buttons",
      "Access the site via HTTPS (or localhost) — verify the HTTPS required message does not appear",
      "Access the site via HTTP (non-localhost) — verify the HTTPS required message appears",
    ],
  },
  {
    category: "Flashing Flow",
    items: [
      "Click a Flash Firmware button — verify the browser prompts for serial port selection",
      "Connect a supported board — verify the flashing process starts and completes",
      "Test with no board connected — verify a helpful error message appears",
      "Test with an invalid manifest URL — verify the button is disabled with a tooltip",
      "Verify that the serial port dialog can be cancelled gracefully",
    ],
  },
  {
    category: "Responsive Design",
    items: [
      "Test at 1920x1080 — cards should display in 3-column grid",
      "Test at 768px width — cards should display in 2-column grid",
      "Test at 375px width — cards should display in single column",
      "Verify the header navigation wraps correctly on small screens",
      "Verify the footer columns stack vertically on mobile",
    ],
  },
  {
    category: "Search & Filtering",
    items: [
      "Type a project name in the search bar — matching projects should appear",
      "Type a partial match — projects containing the text should appear",
      "Click a tag filter button — only projects with that tag should display",
      "Click multiple tags — projects matching any tag should display",
      "Click 'Clear all' — all filters should reset and show all projects",
    ],
  },
];

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="h-4 w-4 text-brand" />
        <h1 className="text-lg font-bold">Verification Checklist</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Use this checklist to verify that Flashie is correctly configured, deployed, and working as expected.
      </p>

      <div className="space-y-8">
        {checks.map((section) => (
          <section key={section.category}>
            <h2 className="text-sm font-semibold mb-3">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-muted text-[10px] font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <XCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold mb-1">Manual Testing Required</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Some checks on this page require manual verification — especially those involving browser serial port
              access, physical hardware, and live deployment URLs. Run through each checklist item after deploying to
              confirm everything works correctly in production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
