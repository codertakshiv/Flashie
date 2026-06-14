"use client";

import { useState, useMemo } from "react";
import { Search, X, Star } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { getAllProjects, getAllTags, filterProjects, getFeaturedProjects } from "@/lib/projects";

export default function ProjectList() {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const allProjects = useMemo(() => getAllProjects(), []);
  const allTags = useMemo(() => getAllTags(), []);
  const featured = useMemo(() => getFeaturedProjects(), []);

  const showFeatured = !search.trim() && activeTags.length === 0;

  const filtered = useMemo(
    () => filterProjects(allProjects, search, activeTags),
    [allProjects, search, activeTags]
  );

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSearch("");
    setActiveTags([]);
  };

  const hasFilters = search.trim() || activeTags.length > 0;

  return (
    <section className="border-b border-border" aria-labelledby="projects-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 id="projects-heading" className="text-sm font-semibold">Available Projects</h2>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {filtered.length} of {allProjects.length} projects
          </span>
        </div>

        {showFeatured && featured.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              Featured Projects
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by name, board, or tag..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              aria-label="Search projects"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by tag">
              {allTags.map((tag) => {
                const isActive = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${tag}`}
                  >
                    {tag}
                  </button>
                );
              })}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="rounded-full px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground mb-1">No projects match your search</p>
            <button
              onClick={clearAll}
              className="text-xs text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
