"use client";

import { useEffect, useState } from "react";
import FlashButton from "@/components/FlashButton";
import { fetchManifest } from "@/lib/projects";
import type { ManifestData } from "@/types";

interface Props {
  manifestPath: string;
}

export default function FlashButtonContainer({ manifestPath }: Props) {
  const [manifestData, setManifestData] = useState<ManifestData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchManifest(manifestPath).then((data) => {
      setManifestData(data);
      setLoaded(true);
    });
  }, [manifestPath]);

  if (!loaded) {
    return <div className="h-9 w-36 rounded-lg bg-muted animate-pulse" />;
  }

  return <FlashButton manifestPath={manifestPath} manifestData={manifestData} />;
}
