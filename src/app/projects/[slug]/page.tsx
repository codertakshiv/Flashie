import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BookOpen, FileText, Calendar, Clock, Download } from "lucide-react";
import GitHubIcon from "@/components/GitHubIcon";
import StatusBadge from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllProjects, formatDownloads } from "@/lib/projects";
import FlashButtonContainer from "./FlashButtonContainer";
import FirmwareSection from "./FirmwareSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.id }));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getAllProjects().find((p) => p.id === slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        aria-label="Back to projects"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to projects
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm text-muted-foreground">Version {project.version}</span>
            {project.lastUpdated && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                Updated {formatDate(project.lastUpdated)}
              </span>
            )}
            {project.downloads !== undefined && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDownloads(project.downloads)} downloads
              </span>
            )}
          </div>
        </div>
        <FlashButtonContainer manifestPath={project.manifestPath} />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{project.description}</p>

      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-6">
        {project.boards.map((board) => (
          <Badge key={board} variant="outline" className="text-xs">
            {board}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tutorialUrl && (
          <Link
            href={project.tutorialUrl}
            className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Tutorial
          </Link>
        )}
        {project.docsUrl && (
          <Link
            href={project.docsUrl}
            className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Documentation
          </Link>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GitHubIcon className="mr-1.5 h-3.5 w-3.5" />
            GitHub
            <ExternalLink className="ml-1 h-3 w-3 text-muted-foreground" aria-hidden="true" />
          </a>
        )}
      </div>

      <FirmwareSection manifestPath={project.manifestPath} />

      {project.changelog && project.changelog.length > 0 && (
        <>
          <Separator className="mb-6" />
          <div className="space-y-4 mb-6">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              Changelog
            </h2>
            {project.changelog.map((entry, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-xs font-semibold">v{entry.version}</h3>
                  <span className="text-[10px] text-muted-foreground">{formatDate(entry.date)}</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {entry.changes.map((change, ci) => (
                    <li key={ci} className="text-[10px] text-muted-foreground leading-relaxed">
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator className="mb-6" />

      {project.notes && project.notes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Notes</h2>
          {project.notes.map((note, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <h3 className="text-xs font-semibold mb-1">{note.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
