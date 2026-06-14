import { AlertTriangle } from "lucide-react";

const warnings = [
  {
    title: "Use Chrome or Edge",
    description:
      "Firmware flashing requires the Web Serial API, which is only supported in Chrome and Microsoft Edge. Firefox, Safari, and other browsers do not support this feature.",
  },
  {
    title: "USB cable quality matters",
    description:
      "Use a high-quality USB data cable. Some cables are charge-only and won't establish a serial connection. If the port isn't detected, try a different cable.",
  },
  {
    title: "Bootloader mode is critical",
    description:
      "For ESP32 boards, the flash will fail if the board is not in bootloader mode. If you see connection errors, press and hold BOOT, tap EN, and release BOOT before retrying.",
  },
  {
    title: "Do not disconnect during flashing",
    description:
      "Interrupting the flashing process can corrupt the firmware and brick your board. Wait for the success confirmation before disconnecting the USB cable.",
  },
  {
    title: "HTTPS is required",
    description:
      "The Web Serial API only works on secure contexts (HTTPS or localhost). If you're running Flashie locally, use http://localhost. For remote access, HTTPS is mandatory.",
  },
];

export default function WarningSection() {
  return (
    <section className="border-b border-border" aria-labelledby="warnings-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
          <h2 id="warnings-heading" className="text-sm font-semibold">Important Warnings</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {warnings.map((warning) => (
            <div
              key={warning.title}
              className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
              <div>
                <h3 className="text-xs font-semibold mb-1">{warning.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{warning.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
