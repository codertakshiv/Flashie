"use client";

import { useEffect, useRef } from "react";
import type { ManifestData } from "@/types";

interface FlashButtonProps {
  manifestPath: string;
  manifestData: ManifestData | null;
}

export default function FlashButton({ manifestPath, manifestData }: FlashButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mounted.current) return;
    mounted.current = true;

    if (!customElements.get("esp-web-install-button")) {
      return;
    }

    const el = document.createElement("esp-web-install-button");
    el.setAttribute("manifest", manifestPath);

    const activateBtn = document.createElement("button");
    activateBtn.slot = "activate";
    activateBtn.className =
      "inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-xs font-medium text-brand-foreground transition-colors hover:bg-brand-hover";
    activateBtn.textContent = "Flash Firmware";
    el.appendChild(activateBtn);

    const unsupportedSpan = document.createElement("span");
    unsupportedSpan.slot = "unsupported";
    unsupportedSpan.className =
      "inline-flex items-center justify-center rounded-lg bg-muted px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed";
    unsupportedSpan.textContent = "Browser not supported";
    el.appendChild(unsupportedSpan);

    const notAllowedSpan = document.createElement("span");
    notAllowedSpan.slot = "not-allowed";
    notAllowedSpan.className =
      "inline-flex items-center justify-center rounded-lg bg-muted px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed";
    notAllowedSpan.textContent = "HTTPS required";
    el.appendChild(notAllowedSpan);

    containerRef.current.appendChild(el);

    return () => {
      if (containerRef.current?.contains(el)) {
        containerRef.current.removeChild(el);
      }
    };
  }, [manifestPath]);

  if (!manifestData || !("builds" in manifestData) || !manifestData.builds) {
    return (
      <button
        disabled
        className="inline-flex items-center justify-center rounded-lg bg-muted px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-not-allowed"
        title="No valid manifest found"
      >
        Flash Firmware
      </button>
    );
  }

  return <div ref={containerRef} className="inline-flex" />;
}
