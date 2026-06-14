"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FirmwareFileTable from "@/components/FirmwareFileTable";
import type { ManifestData } from "@/types";
import { fetchManifest } from "@/lib/projects";

interface FirmwareSectionProps {
  manifestPath: string;
}

export default function FirmwareSection({ manifestPath }: FirmwareSectionProps) {
  const [manifest, setManifest] = useState<ManifestData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchManifest(manifestPath).then((data) => {
      if (!cancelled) setManifest(data);
    });
    return () => { cancelled = true; };
  }, [manifestPath]);

  if (!manifest?.builds?.length) return null;

  return (
    <>
      <Separator className="mb-6" />
      <FirmwareFileTable builds={manifest.builds} manifestPath={manifestPath} />
      <div className="mb-6" />
    </>
  );
}
