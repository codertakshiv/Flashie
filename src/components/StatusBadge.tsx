import type { ProjectStatus } from "@/types";
import { statusColor } from "@/lib/projects";

interface StatusBadgeProps {
  status?: ProjectStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor(status)}`}
    >
      {status}
    </span>
  );
}
