import { Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
            <Zap className="h-6 w-6 text-brand" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Flash firmware from your browser
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Flashie lets you flash firmware to ESP32, ESP8266, STM32, and Arduino boards
            directly from Chrome or Microsoft Edge. No desktop software installation required.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              Web Serial API
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              ESP Web Tools
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              No Install Required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

