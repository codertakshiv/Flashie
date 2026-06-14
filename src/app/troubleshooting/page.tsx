import { AlertTriangle, ChevronDown } from "lucide-react";
import TroubleshootingSection from "@/components/TroubleshootingSection";

const problems = [
  {
    title: "No serial port is listed",
    steps: [
      "Ensure your board is connected via a USB data cable (not a charge-only cable).",
      "Install the appropriate USB-to-serial driver (CH340, CP2102, or FTDI).",
      "Check Device Manager (Windows) or run lsusb (Linux/Mac) to see if the device is detected.",
      "Try a different USB port on your computer.",
      "Restart your browser and try again.",
    ],
  },
  {
    title: "Flashing starts but fails mid-way",
    steps: [
      "Your board may have exited bootloader mode. Re-enter bootloader mode and try again.",
      "The USB cable may be unstable. Try a shorter or higher-quality cable.",
      "Close other applications that might be using the serial port (Arduino IDE, serial monitors).",
      "Try a different USB port (preferably USB 2.0).",
    ],
  },
  {
    title: "Failed to download manifest.json",
    steps: [
      "Verify the manifest URL is correct by opening it directly in your browser.",
      "Ensure the manifest file exists in the public/projects/ directory.",
      "If using GitHub Pages, wait for the deployment to complete (can take 2-3 minutes).",
      "Clear your browser cache and perform a hard refresh (Ctrl+F5).",
      "Check that the file paths use the correct case (GitHub Pages is case-sensitive).",
    ],
  },
  {
    title: "Flash button says 'Browser not supported'",
    steps: [
      "Switch to Google Chrome or Microsoft Edge (version 89 or later).",
      "Update your browser to the latest version.",
      "Mobile browsers do not support the Web Serial API. Use a desktop/laptop computer.",
    ],
  },
  {
    title: "Flash button says 'HTTPS required'",
    steps: [
      "Access Flashie via HTTPS or localhost.",
      "If running locally, use http://localhost instead of http://127.0.0.1.",
      "For remote access, ensure your site is served over HTTPS.",
    ],
  },
  {
    title: "ESP32 not entering bootloader mode",
    steps: [
      "Hold the BOOT button, press EN once, then release BOOT — timing matters.",
      "Some ESP32 dev boards have an auto-reset circuit. Try pressing BOOT alone while the flash begins.",
      "Check that the BOOT button is connected to GPIO0 (not EN).",
      "Try connecting GPIO0 to GND manually with a jumper wire.",
    ],
  },
];

export default function TroubleshootingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <h1 className="text-lg font-bold">Troubleshooting Guide</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Common issues and solutions for firmware flashing with Flashie.
      </p>

      <div className="space-y-4 mb-10">
        {problems.map((problem) => (
          <div key={problem.title} className="rounded-lg border border-border p-4">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              {problem.title}
            </h2>
            <ol className="list-decimal pl-4 space-y-1.5">
              {problem.steps.map((step, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <TroubleshootingSection />
    </div>
  );
}
