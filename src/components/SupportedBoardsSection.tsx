import { Cpu, Radio, Server, Monitor } from "lucide-react";

const boardCategories = [
  {
    Icon: Radio,
    name: "ESP32 Series",
    description: "ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP32-C6",
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  {
    Icon: Radio,
    name: "ESP8266 Series",
    description: "ESP8266, ESP-01, ESP-12, NodeMCU, Wemos D1 Mini",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    Icon: Cpu,
    name: "STM32 Series",
    description: "STM32F103 (Blue Pill), STM32F4 (Black Pill), STM32G0",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    Icon: Server,
    name: "Arduino Boards",
    description: "Arduino Uno, Nano, Mega, Leonardo, Micro",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    Icon: Monitor,
    name: "Custom Boards",
    description: "Any board with Web Serial or DFU support can be integrated",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
];

export default function SupportedBoardsSection() {
  return (
    <section className="border-b border-border" aria-labelledby="boards-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 id="boards-heading" className="text-sm font-semibold">Supported Boards</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boardCategories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-3 rounded-lg border border-border p-4"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.bgColor}`}>
                <cat.Icon className={`h-4 w-4 ${cat.color}`} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xs font-semibold">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
