import type { Project, ManifestData, ProjectsData, ProjectStatus } from "@/types";
import rawData from "@/data/projects.json";

const data = rawData as ProjectsData;

export function getAllProjects(): Project[] {
  return data.projects;
}

export function getProjectById(id: string): Project | undefined {
  return data.projects.find((p) => p.id === id);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  data.projects.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getFeaturedProjects(): Project[] {
  return data.projects.filter((p) => p.featured);
}

export function getProjectStats() {
  const all = data.projects;
  const boardFamilies = new Set<string>();
  all.forEach((p) => p.boards.forEach((b) => boardFamilies.add(b)));
  return {
    totalProjects: all.length,
    boardFamilies: boardFamilies.size,
    totalReleases: all.reduce((sum, p) => sum + (p.changelog?.length || 0), 0),
  };
}

export function formatDownloads(count?: number): string {
  if (!count) return "0";
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toLocaleString();
}

export function statusColor(status?: ProjectStatus): string {
  switch (status) {
    case "Stable": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Beta": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Experimental": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    case "Deprecated": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Development": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

export function filterProjects(
  projects: Project[],
  search: string,
  activeTags: string[]
): Project[] {
  let result = projects;
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.boards.some((b) => b.toLowerCase().includes(q)) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (activeTags.length > 0) {
    result = result.filter((p) =>
      activeTags.some((tag) => p.tags?.includes(tag))
    );
  }
  return result;
}

export async function fetchManifest(manifestPath: string): Promise<ManifestData | null> {
  try {
    const res = await fetch(manifestPath);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
