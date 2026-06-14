import { ChevronDown, Wifi, Link2, AlertCircle, FolderOpen, RefreshCw, Usb } from "lucide-react";

const faqs = [
  {
    Icon: Link2,
    title: "Failed to download manifest",
    description:
      "This error occurs when the manifest.json file cannot be fetched. Verify the manifest URL in your project configuration points to the correct file path. Check that the file exists in the public/projects/&lt;project&gt;/ directory and that GitHub Pages has deployed the latest changes. Clear your browser cache and try again.",
  },
  {
    Icon: Wifi,
    title: "Flashing connection failures",
    description:
      "Connection failures usually mean the board is not in bootloader mode. For ESP32, hold the BOOT button, press EN, then release BOOT. For ESP8266, connect GPIO0 to GND before powering on. Also check that you selected the correct serial port and that no other program (like Arduino IDE) is using it.",
  },
  {
    Icon: FolderOpen,
    title: "GitHub Pages 404 errors",
    description:
      "404 errors on GitHub Pages often indicate incorrect file paths. Ensure your manifest.json path starts with a forward slash and points to the correct location under the public/ folder. Remember that GitHub Pages is case-sensitive. File paths in manifests and firmware references must match exactly.",
  },
  {
    Icon: AlertCircle,
    title: "Incorrect firmware paths",
    description:
      "Firmware paths in the manifest.json are relative to the manifest file location. For example, if your manifest is at /projects/my-project/manifest.json and firmware is at /projects/my-project/firmware/firmware.bin, the path in manifest should be firmware/firmware.bin (not absolute).",
  },
  {
    Icon: RefreshCw,
    title: "Browser cache issues",
    description:
      "Outdated cache can cause stale manifests or firmware to be served. Perform a hard refresh (Ctrl+F5 or Cmd+Shift+R) to bypass the cache. Alternatively, open DevTools, go to the Network tab, and check 'Disable cache'. For persistent issues, clear all site data in Chrome settings.",
  },
  {
    Icon: Usb,
    title: "USB driver problems",
    description:
      "Many ESP32/ESP8266 boards use CH340 or CP2102 USB-to-serial chips. Windows may need drivers: download CH340 drivers or CP2102 drivers from the manufacturer. On macOS and Linux, these usually work out of the box. For STM32 boards, you may need the Zadig tool to install WinUSB drivers for DFU mode.",
  },
];

const driverLinks = [
  { name: "CH340 Driver", url: "https://www.wch.cn/download/CH341SER_EXE.html" },
  { name: "CP2102 Driver", url: "https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" },
  { name: "FTDI Driver", url: "https://ftdichip.com/drivers/" },
  { name: "Zadig (STM32 DFU)", url: "https://zadig.akeo.ie/" },
];

export default function TroubleshootingSection() {
  return (
    <section aria-labelledby="troubleshooting-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <ChevronDown className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 id="troubleshooting-heading" className="text-sm font-semibold">Troubleshooting</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.title} className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <faq.Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-xs font-semibold">{faq.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-border p-4">
          <h3 className="text-xs font-semibold mb-3">Common USB Driver Downloads</h3>
          <div className="flex flex-wrap gap-2">
            {driverLinks.map((driver) => (
              <a
                key={driver.name}
                href={driver.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Usb className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                {driver.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
