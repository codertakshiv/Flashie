import { HardDrive } from "lucide-react";
import type { BuildConfig } from "@/types";
import CopyButton from "@/components/CopyButton";

interface FirmwareFileTableProps {
  builds?: BuildConfig[];
  manifestPath: string;
}

export default function FirmwareFileTable({ builds, manifestPath }: FirmwareFileTableProps) {
  if (!builds || builds.length === 0) return null;

  const baseUrl = manifestPath.substring(0, manifestPath.lastIndexOf("/"));

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold flex items-center gap-2">
        <HardDrive className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        Firmware Files
      </h2>
      {builds.map((build, bi) => (
        <div key={bi} className="rounded-lg border border-border">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs font-medium">{build.chipFamily}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">File</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Offset</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Size</th>
                </tr>
              </thead>
              <tbody>
                {build.parts.map((part, pi) => {
                  const filePath = `${baseUrl}/${part.path}`;
                  return (
                    <tr key={pi} className="border-b border-border last:border-b-0">
                      <td className="px-3 py-2 text-muted-foreground font-mono">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{part.path}</span>
                          <CopyButton text={filePath} label="Path" />
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground font-mono">{part.offset}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground font-mono">-</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
