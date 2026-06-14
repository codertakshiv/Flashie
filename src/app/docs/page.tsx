import { FileText } from "lucide-react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: (
      <>
        <p>
          Flashie is a browser-based firmware flashing platform that uses the Web Serial API to flash firmware directly to
          microcontrollers. No desktop software installation is required — just a compatible browser and a USB connection.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">Requirements</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
          <li>Google Chrome or Microsoft Edge (version 89 or later)</li>
          <li>A supported microcontroller board (ESP32, ESP8266, STM32, Arduino)</li>
          <li>A USB data cable (not charge-only)</li>
          <li>An internet connection to download firmware files</li>
        </ul>
      </>
    ),
  },
  {
    id: "browser-compatibility",
    title: "Browser Compatibility",
    content: (
      <>
        <p>
          Firmware flashing relies on the Web Serial API, which is only available in certain browsers.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">Supported Browsers</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
          <li><strong>Google Chrome</strong> (v89+) — Fully supported</li>
          <li><strong>Microsoft Edge</strong> (v89+) — Fully supported</li>
          <li><strong>Opera</strong> (v76+) — Supported</li>
          <li><strong>Samsung Internet</strong> (v15+) — Limited support</li>
        </ul>
        <h4 className="text-xs font-semibold mt-4 mb-2">Unsupported Browsers</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
          <li><strong>Mozilla Firefox</strong> — No Web Serial API support</li>
          <li><strong>Safari</strong> — No Web Serial API support</li>
          <li>Mobile browsers generally do not support Web Serial</li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          If you see &ldquo;Browser not supported&rdquo; on the flash button, please switch to Chrome or Edge.
        </p>
      </>
    ),
  },
  {
    id: "creating-new-projects",
    title: "Creating New Projects",
    content: (
      <>
        <p>
          To add a new firmware project to Flashie, follow these steps:
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">1. Create the folder structure</h4>
        <pre className="rounded-lg bg-muted p-3 text-[10px] font-mono leading-relaxed overflow-x-auto">
{`public/
  projects/
    your-project-name/
      manifest.json
      firmware/
        bootloader.bin
        partitions.bin
        firmware.bin`}
        </pre>
        <h4 className="text-xs font-semibold mt-4 mb-2">2. Create a manifest.json</h4>
        <p className="text-xs text-muted-foreground mb-2">
          The manifest file defines the firmware files and their memory offsets for each chip family.
        </p>
        <pre className="rounded-lg bg-muted p-3 text-[10px] font-mono leading-relaxed overflow-x-auto">
{`{
  "name": "Your Project",
  "version": "1.0.0",
  "new_install_prompt_erase": true,
  "builds": [
    {
      "chipFamily": "ESP32",
      "parts": [
        { "path": "firmware/bootloader.bin", "offset": "0x1000" },
        { "path": "firmware/partitions.bin", "offset": "0x8000" },
        { "path": "firmware/firmware.bin", "offset": "0x10000" }
      ]
    }
  ]
}`}
        </pre>
        <h4 className="text-xs font-semibold mt-4 mb-2">3. Add firmware files</h4>
        <p className="text-xs text-muted-foreground">
          Place your compiled firmware binaries in the firmware/ folder. The paths in manifest.json
          are relative to the manifest file location.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">4. Register the project</h4>
        <p className="text-xs text-muted-foreground">
          Add a new entry to <code className="text-xs text-foreground">src/data/projects.json</code> or use the{" "}
          <a href="/manage" className="text-brand hover:underline">Manage page</a> to generate the configuration.
        </p>
      </>
    ),
  },
  {
    id: "manifest-format",
    title: "Manifest File Format",
    content: (
      <>
        <p>
          The manifest.json follows the{" "}
          <a href="https://esphome.github.io/esp-web-tools/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            ESP Web Tools manifest format
          </a>.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">Top-level fields</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
          <li><strong>name</strong> — Human-readable project name</li>
          <li><strong>version</strong> — Firmware version string</li>
          <li><strong>builds</strong> — Array of build configurations (one per chip family)</li>
          <li><strong>new_install_prompt_erase</strong> — Set to true to prompt for erase before flashing</li>
          <li><strong>funding_url</strong> — Optional funding link</li>
        </ul>
        <h4 className="text-xs font-semibold mt-4 mb-2">Build object fields</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
          <li><strong>chipFamily</strong> — Target chip (ESP32, ESP32-S3, ESP32-C3, ESP8266, etc.)</li>
          <li><strong>parts</strong> — Array of firmware files with paths and offsets</li>
        </ul>
        <h4 className="text-xs font-semibold mt-4 mb-2">Part object fields</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
          <li><strong>path</strong> — Relative path from manifest to firmware file</li>
          <li><strong>offset</strong> — Memory offset as string (e.g., &ldquo;0x1000&rdquo;)</li>
        </ul>
      </>
    ),
  },
  {
    id: "firmware-paths",
    title: "Firmware File Paths",
    content: (
      <>
        <p>
          Firmware paths in the manifest.json are <strong>relative</strong> to the manifest file itself.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">Example</h4>
        <p className="text-xs text-muted-foreground mb-2">
          If your manifest is at <code className="text-xs text-foreground">/projects/my-project/manifest.json</code>:
        </p>
        <pre className="rounded-lg bg-muted p-3 text-[10px] font-mono leading-relaxed overflow-x-auto">
{`// Correct (relative path):
{ "path": "firmware/firmware.bin", "offset": "0x10000" }

// Wrong (absolute path will 404 on GitHub Pages):
{ "path": "/projects/my-project/firmware/firmware.bin", "offset": "0x10000" }`}
        </pre>
        <p className="mt-3 text-xs text-muted-foreground">
          On GitHub Pages, files in the <code className="text-xs text-foreground">public/</code> folder are served at the root URL.
          A file at <code className="text-xs text-foreground">public/projects/my-project/firmware/firmware.bin</code> is
          accessible at <code className="text-xs text-foreground">https://your-site.com/projects/my-project/firmware/firmware.bin</code>.
        </p>
      </>
    ),
  },
  {
    id: "testing-manifests",
    title: "Testing Manifests",
    content: (
      <>
        <p>
          You can test your manifest files directly in the browser before deploying:
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">1. Open the manifest URL</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Navigate to your manifest file URL (e.g., <code className="text-xs text-foreground">https://your-site.com/projects/my-project/manifest.json</code>).
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">2. Verify the JSON</h4>
        <p className="text-xs text-muted-foreground mb-2">
          The browser should display the parsed JSON. Check that all paths and offsets are correct.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">3. Test firmware paths</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Navigate to each firmware file URL to ensure it downloads correctly. A 404 means the path is wrong.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">4. Use the Manage page</h4>
        <p className="text-xs text-muted-foreground">
          The <a href="/manage" className="text-brand hover:underline">Manage page</a> lets you edit project metadata and generate updated configuration.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">5. Run the verification checklist</h4>
        <p className="text-xs text-muted-foreground">
          After deploying, use the{" "}
          <a href="/verify" className="text-brand hover:underline">Verification Checklist</a>{" "}
          to confirm everything is working correctly.
        </p>
      </>
    ),
  },
  {
    id: "deploying-updates",
    title: "Deploying Updates",
    content: (
      <>
        <p>
          To update firmware or add new projects:
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">Updating firmware</h4>
        <ol className="list-decimal pl-4 space-y-1 text-xs text-muted-foreground">
          <li>Replace the firmware binary files in <code className="text-xs text-foreground">public/projects/&lt;project&gt;/firmware/</code></li>
          <li>Update the version number in the manifest.json</li>
          <li>Commit and push to GitHub</li>
          <li>GitHub Pages will deploy automatically</li>
        </ol>
        <h4 className="text-xs font-semibold mt-4 mb-2">Adding new projects</h4>
        <ol className="list-decimal pl-4 space-y-1 text-xs text-muted-foreground">
          <li>Create a new folder under <code className="text-xs text-foreground">public/projects/</code></li>
          <li>Add a manifest.json and firmware files</li>
          <li>Add the project entry to <code className="text-xs text-foreground">src/data/projects.json</code></li>
          <li>Rebuild and deploy</li>
        </ol>
      </>
    ),
  },
  {
    id: "enabling-github-pages",
    title: "Enabling GitHub Pages",
    content: (
      <>
        <p>
          Flashie is configured for GitHub Pages static hosting. Follow these steps to deploy:
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">1. Push to GitHub</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Create a repository and push your code.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">2. Configure GitHub Pages</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Go to Settings &rarr; Pages and select &ldquo;GitHub Actions&rdquo; as the source.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">3. Add a GitHub Actions workflow</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Create <code className="text-xs text-foreground">.github/workflows/deploy.yml</code>:
        </p>
        <pre className="rounded-lg bg-muted p-3 text-[10px] font-mono leading-relaxed overflow-x-auto">
{`name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{\secrets.GITHUB_TOKEN }}
          publish_dir: ./out`}
        </pre>
        <h4 className="text-xs font-semibold mt-4 mb-2">4. Configure basePath (if needed)</h4>
        <p className="text-xs text-muted-foreground">
          If deploying to a sub-path like <code className="text-xs text-foreground">https://user.github.io/repo-name/</code>,
          update <code className="text-xs text-foreground">basePath</code> in <code className="text-xs text-foreground">next.config.ts</code> to <code className="text-xs text-foreground">/repo-name</code>.
        </p>
      </>
    ),
  },
  {
    id: "esp-bootloader",
    title: "Entering Bootloader Mode",
    content: (
      <>
        <p>
          Most boards need to be in bootloader mode before flashing. Here&apos;s how for each type:
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">ESP32</h4>
        <ol className="list-decimal pl-4 space-y-1 text-xs text-muted-foreground">
          <li>Press and hold the <strong>BOOT</strong> button (usually labeled GPIO0)</li>
          <li>Press and release the <strong>EN</strong> (reset) button</li>
          <li>Release the <strong>BOOT</strong> button</li>
          <li>The board is now in download mode</li>
        </ol>
        <h4 className="text-xs font-semibold mt-4 mb-2">ESP8266</h4>
        <p className="text-xs text-muted-foreground">
          Connect GPIO0 to GND and power cycle the board. Some development boards have a dedicated FLASH button.
        </p>
        <h4 className="text-xs font-semibold mt-4 mb-2">STM32 (DFU mode)</h4>
        <ol className="list-decimal pl-4 space-y-1 text-xs text-muted-foreground">
          <li>Set <strong>BOOT0</strong> pin to HIGH (connect to 3.3V)</li>
          <li>Set <strong>BOOT1</strong> pin to LOW (connect to GND)</li>
          <li>Press and release the <strong>RESET</strong> button</li>
          <li>The board appears as a DFU device</li>
        </ol>
        <h4 className="text-xs font-semibold mt-4 mb-2">Arduino</h4>
        <p className="text-xs text-muted-foreground">
          Arduino boards typically enter bootloader mode automatically when a new sketch is uploaded via serial. No manual
          steps are usually required.
        </p>
      </>
    ),
  },
  {
    id: "faq",
    title: "FAQ",
    content: (
      <>
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-semibold mb-1">Do I need to install anything?</h4>
            <p className="text-xs text-muted-foreground">
              No. Flashie works entirely in your browser. You only need Chrome or Edge.
              Some boards may need USB drivers (CH340, CP2102) installed on your system.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1">Will this work on Firefox or Safari?</h4>
            <p className="text-xs text-muted-foreground">
              No. The Web Serial API is not available in Firefox or Safari. Please use Chrome or Edge.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1">Why does the flash button show &ldquo;Browser not supported&rdquo;?</h4>
            <p className="text-xs text-muted-foreground">
              You&apos;re using a browser that doesn&apos;t support the Web Serial API. Switch to Chrome or Edge.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1">Why does it say &ldquo;HTTPS required&rdquo;?</h4>
            <p className="text-xs text-muted-foreground">
              The Web Serial API requires a secure context. If you&apos;re running locally, use http://localhost.
              For remote access, HTTPS is mandatory.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1">My board isn&apos;t detected. What do I do?</h4>
            <p className="text-xs text-muted-foreground">
              Check your USB cable (use a data cable, not charge-only), install the appropriate USB-to-serial driver
              (CH340, CP2102, or FTDI), and ensure the board is in bootloader mode.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1">The flash failed halfway through. Is my board bricked?</h4>
            <p className="text-xs text-muted-foreground">
              Probably not. Most boards can recover by re-entering bootloader mode and trying again. If the flash
              was interrupted, re-flash the correct firmware. ESP32 boards have a built-in recovery mechanism.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1">How do I add my own firmware project?</h4>
            <p className="text-xs text-muted-foreground">
              Create a project folder under <code className="text-xs text-foreground">public/projects/</code> with a
              manifest.json and firmware files, then add an entry to <code className="text-xs text-foreground">src/data/projects.json</code>.
              See the <a href="/docs#creating-new-projects" className="text-brand hover:underline">Creating New Projects</a> guide.
            </p>
          </div>
        </div>
      </>
    ),
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-4 w-4 text-brand" />
        <h1 className="text-lg font-bold">Documentation</h1>
      </div>
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-sm font-semibold mb-3">{section.title}</h2>
            <div className="rounded-lg border border-border p-4 text-xs text-muted-foreground leading-relaxed space-y-2">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
