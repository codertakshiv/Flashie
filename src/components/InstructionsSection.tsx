import { Info } from "lucide-react";

const instructions = [
  {
    step: 1,
    title: "Connect your board",
    description:
      "Plug your ESP, STM32, or Arduino board into your computer using a USB cable. Make sure the board is recognized by your operating system.",
  },
  {
    step: 2,
    title: "Enter bootloader mode (if needed)",
    description:
      "For ESP32: Hold the BOOT button, tap EN, then release BOOT. For STM32: Set BOOT0 to HIGH, BOOT1 to LOW, then press RESET. Arduino boards enter bootloader mode automatically.",
  },
  {
    step: 3,
    title: "Select your project",
    description:
      "Browse the available firmware projects on this page and choose the one you want to flash. Check the supported boards list to ensure compatibility.",
  },
  {
    step: 4,
    title: "Click Flash Firmware",
    description:
      "Click the green Flash Firmware button on your chosen project. A browser dialog will appear asking you to select the serial port your board is connected to.",
  },
  {
    step: 5,
    title: "Select the serial port",
    description:
      "In the dialog, select the serial port (e.g., COM3, /dev/ttyUSB0, /dev/cu.usbserial) and click Connect. The flashing process will begin automatically.",
  },
  {
    step: 6,
    title: "Wait for completion",
    description:
      "The firmware will be downloaded and flashed to your board. Do not disconnect the USB cable during this process. Wait for the success message before unplugging.",
  },
];

export default function InstructionsSection() {
  return (
    <section className="border-b border-border" aria-labelledby="instructions-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 id="instructions-heading" className="text-sm font-semibold">How to Flash Firmware</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructions.map((item) => (
            <div key={item.step} className="flex gap-3 rounded-lg border border-border p-4">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand/10 text-xs font-semibold text-brand"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <div>
                <h3 className="text-xs font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
