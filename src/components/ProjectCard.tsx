"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, FileText, Cpu, Calendar, Download } from "lucide-react";
import GitHubIcon from "@/components/GitHubIcon";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import FlashButton from "@/components/FlashButton";
import type { Project, ManifestData } from "@/types";
import { fetchManifest, formatDownloads } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [manifestData, setManifestData] = useState<ManifestData | null>(null);
  const [manifestLoaded, setManifestLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchManifest(project.manifestPath).then((data) => {
      if (!cancelled) {
        setManifestData(data);
        setManifestLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, [project.manifestPath]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
              <Cpu className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">{project.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">v{project.version}</span>
                {project.lastUpdated && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {project.lastUpdated}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={project.status} />
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {project.boards.length > 1
                ? `${project.boards[0].replace(/ESP\d+-?/, "ESP")} +${project.boards.length - 1}`
                : project.boards[0]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 flex-1">
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          {project.downloads !== undefined && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
              <Download className="h-3 w-3" aria-hidden="true" />
              {formatDownloads(project.downloads)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-0">
        <div className="flex w-full gap-2">
          {manifestLoaded && (
            <FlashButton manifestPath={project.manifestPath} manifestData={manifestData} />
          )}
          {project.tutorialUrl && (
            <Link
              href={project.tutorialUrl}
              className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2.5 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${project.name} tutorial`}
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Tutorial
            </Link>
          )}
        </div>
        <div className="flex w-full gap-2">
          {project.docsUrl && (
            <Link
              href={project.docsUrl}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${project.name} documentation`}
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Docs
            </Link>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${project.name} GitHub repository`}
            >
              <GitHubIcon className="mr-1.5 h-3.5 w-3.5" />
              GitHub
              <ExternalLink className="ml-1 h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
