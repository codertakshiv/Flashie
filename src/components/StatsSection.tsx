import { getProjectStats } from "@/lib/projects";
import { Cpu, Package, GitCommit } from "lucide-react";

export default function StatsSection() {
  const stats = getProjectStats();

  const items = [
    {
      icon: Package,
      label: "Firmware Projects",
      value: stats.totalProjects,
    },
    {
      icon: Cpu,
      label: "Board Families",
      value: stats.boardFamilies,
    },
    {
      icon: GitCommit,
      label: "Total Releases",
      value: stats.totalReleases,
    },
  ];

  return (
    <section className="border-b border-border" aria-labelledby="stats-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-lg border border-border p-5 text-center"
            >
              <item.icon className="h-5 w-5 text-brand mb-2" aria-hidden="true" />
              <span className="text-2xl font-bold tabular-nums">{item.value}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
