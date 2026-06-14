"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Save, Trash2, FileText, Cpu, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Project, ProjectsData, EditableProject, ValidationError, EditableField, ProjectStatus } from "@/types";
import rawData from "@/data/projects.json";

const defaultProject: EditableProject = {
  id: "",
  name: "",
  description: "",
  version: "1.0.0",
  boards: [],
  tags: [],
  manifestPath: "",
  githubUrl: "",
  docsUrl: "",
  tutorialUrl: "",
  notes: [],
  changelog: [],
  status: "Development" as const,
  downloads: 0,
};

function validate(project: EditableProject): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!project.id.trim()) errors.push({ field: "id", message: "Project ID is required" });
  else if (!/^[a-z0-9-]+$/.test(project.id.trim()))
    errors.push({ field: "id", message: "ID must be lowercase alphanumeric with hyphens only" });
  if (!project.name.trim()) errors.push({ field: "name", message: "Project name is required" });
  if (!project.version.trim()) errors.push({ field: "version", message: "Version is required" });
  else if (!/^\d+\.\d+\.\d+$/.test(project.version.trim()))
    errors.push({ field: "version", message: "Version must be semver (e.g. 1.0.0)" });
  if (!project.manifestPath.trim()) errors.push({ field: "manifestPath", message: "Manifest path is required" });
  else if (!project.manifestPath.startsWith("/"))
    errors.push({ field: "manifestPath", message: "Manifest path must start with /" });
  else if (!project.manifestPath.endsWith("manifest.json"))
    errors.push({ field: "manifestPath", message: "Manifest path must end with manifest.json" });
  if (project.boards.length === 0) errors.push({ field: "boards", message: "At least one board is required" });
  return errors;
}

export default function ManagePage() {
  const [projects, setProjects] = useState<EditableProject[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [jsonOutput, setJsonOutput] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    setProjects((rawData as ProjectsData).projects.map((p) => ({ ...p })));
  }, []);

  const selected = selectedIndex !== null ? projects[selectedIndex] : null;

  useEffect(() => {
    if (selected) setErrors(validate(selected));
    else setErrors([]);
  }, [selected]);

  const update = useCallback((index: number, field: keyof EditableProject, value: unknown) => {
    setProjects((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addBoard = useCallback((index: number) => {
    const p = projects[index];
    if (!p._newBoard?.trim()) return;
    update(index, "boards", [...p.boards, p._newBoard.trim()]);
    update(index, "_newBoard", "");
  }, [projects, update]);

  const removeBoard = useCallback((index: number, boardIndex: number) => {
    const p = projects[index];
    update(index, "boards", p.boards.filter((_, i) => i !== boardIndex));
  }, [projects, update]);

  const addTag = useCallback((index: number) => {
    const p = projects[index];
    if (!p._newTag?.trim()) return;
    update(index, "tags", [...(p.tags || []), p._newTag.trim()]);
    update(index, "_newTag", "");
  }, [projects, update]);

  const removeTag = useCallback((index: number, tagIndex: number) => {
    const p = projects[index];
    update(index, "tags", (p.tags || []).filter((_, i) => i !== tagIndex));
  }, [projects, update]);

  const addNote = useCallback((index: number) => {
    const p = projects[index];
    if (!p._newNoteTitle?.trim()) return;
    setProjects((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        notes: [
          ...(next[index].notes || []),
          { title: p._newNoteTitle!.trim(), content: p._newNoteContent?.trim() || "" },
        ],
        _newNoteTitle: "",
        _newNoteContent: "",
      };
      return next;
    });
  }, []);

  const removeNote = useCallback((projectIndex: number, noteIndex: number) => {
    setProjects((prev) => {
      const next = [...prev];
      next[projectIndex] = {
        ...next[projectIndex],
        notes: next[projectIndex].notes?.filter((_, i) => i !== noteIndex) || [],
      };
      return next;
    });
  }, []);

  const addChangelogEntry = useCallback((index: number) => {
    const p = projects[index];
    if (!p._newChangelogVersion?.trim() || !p._newChangelogChange?.trim()) return;
    setProjects((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        changelog: [
          ...(next[index].changelog || []),
          {
            version: p._newChangelogVersion!.trim(),
            date: p._newChangelogDate?.trim() || new Date().toISOString().split("T")[0],
            changes: [p._newChangelogChange!.trim()],
          },
        ],
        _newChangelogVersion: "",
        _newChangelogDate: "",
        _newChangelogChange: "",
      };
      return next;
    });
  }, []);

  const removeChangelog = useCallback((projectIndex: number, entryIndex: number) => {
    setProjects((prev) => {
      const next = [...prev];
      next[projectIndex] = {
        ...next[projectIndex],
        changelog: next[projectIndex].changelog?.filter((_, i) => i !== entryIndex) || [],
      };
      return next;
    });
  }, []);

  const addProject = useCallback(() => {
    setProjects((prev) => [
      ...prev,
      { ...defaultProject, id: `project-${prev.length + 1}`, name: `Project ${prev.length + 1}` },
    ]);
    setSelectedIndex(projects.length);
  }, [projects.length]);

  const removeProject = useCallback((index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex((prev) => (prev === index ? null : prev));
  }, []);

  const getFieldError = (field: string): string | undefined =>
    errors.find((e) => e.field === field)?.message;

  const generateOutput = useCallback(() => {
    const output: ProjectsData = {
      projects: projects.map(
        ({ _newBoard, _newNoteTitle, _newNoteContent, _newTag, _newChangelogVersion, _newChangelogDate, _newChangelogChange, ...rest }) => ({
          ...rest,
          tags: rest.tags?.length ? rest.tags : undefined,
          notes: rest.notes?.length ? rest.notes : undefined,
          changelog: rest.changelog?.length ? rest.changelog : undefined,
          featured: rest.featured === true || undefined,
          status: rest.status || undefined,
          screenshot: rest.screenshot || undefined,
          downloads: (rest.downloads ?? 0) > 0 ? rest.downloads : undefined,
        }),
      ),
    };
    setJsonOutput(JSON.stringify(output, null, 2));
  }, [projects]);

  const field = (label: string, fieldName: EditableField, placeholder?: string) => {
    if (!selected || selectedIndex === null) return null;
    const err = getFieldError(fieldName);
    return (
      <div className="space-y-1.5">
        <Label htmlFor={`f-${fieldName}`} className="text-xs">{label}</Label>
        <Input
          id={`f-${fieldName}`}
          value={(selected[fieldName] as string) || ""}
          onChange={(e) => update(selectedIndex, fieldName, e.target.value)}
          className={`text-xs h-8 ${err ? "border-destructive" : ""}`}
          placeholder={placeholder}
          aria-invalid={!!err}
          aria-describedby={err ? `e-${fieldName}` : undefined}
        />
        {err && <p id={`e-${fieldName}`} className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{err}</p>}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold">Manage Projects</h1>
          <p className="text-sm text-muted-foreground">Edit project metadata and export updated configuration.</p>
        </div>
        <Button onClick={addProject} size="sm" className="gap-1.5" aria-label="Add a new project">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav className="space-y-1" aria-label="Project list">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelectedIndex(i)}
              className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedIndex === i
                  ? "border-brand bg-brand/5"
                  : "border-border hover:bg-accent"
              }`}
              aria-current={selectedIndex === i ? "true" : undefined}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/10">
                <Cpu className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{p.name || "Unnamed"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{p.id}</p>
              </div>
            </button>
          ))}
        </nav>

        <div>
          {selected && selectedIndex !== null ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <h2 className="text-sm font-semibold">Editing: {selected.name}</h2>
                <Button variant="destructive" size="sm" onClick={() => removeProject(selectedIndex)} aria-label={`Delete ${selected.name}`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Project ID", "id", "unique-id")}
                  {field("Version", "version", "1.0.0")}
                </div>
                {field("Project Name", "name")}
                <div className="space-y-1.5">
                  <Label htmlFor="f-description" className="text-xs">Description</Label>
                  <Textarea
                    id="f-description"
                    value={selected.description}
                    onChange={(e) => update(selectedIndex, "description", e.target.value)}
                    className="text-xs min-h-[60px]"
                  />
                </div>
                {field("Manifest Path", "manifestPath", "/projects/my-project/manifest.json")}

                <div className="grid gap-3 sm:grid-cols-3">
                  {field("GitHub URL", "githubUrl")}
                  {field("Docs URL", "docsUrl")}
                  {field("Tutorial URL", "tutorialUrl")}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="f-status" className="text-xs">Status</Label>
                    <select
                      id="f-status"
                      value={selected.status || ""}
                      onChange={(e) => update(selectedIndex, "status", e.target.value || undefined)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                      aria-label="Project status"
                    >
                      <option value="">None</option>
                      <option value="Stable">Stable</option>
                      <option value="Beta">Beta</option>
                      <option value="Experimental">Experimental</option>
                      <option value="Deprecated">Deprecated</option>
                      <option value="Development">Development</option>
                    </select>
                  </div>
                  {field("Screenshot Path", "screenshot", "/images/project.png")}
                  {field("Downloads", "downloads", "0")}
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Supported Boards</Label>
                  {getFieldError("boards") && (
                    <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{getFieldError("boards")}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selected.boards.map((board, bi) => (
                      <Badge key={bi} variant="secondary" className="gap-1 text-[10px]">
                        {board}
                        <button onClick={() => removeBoard(selectedIndex, bi)} className="text-muted-foreground hover:text-foreground" aria-label={`Remove ${board}`}>
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <Input
                      value={selected._newBoard || ""}
                      onChange={(e) => update(selectedIndex, "_newBoard", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addBoard(selectedIndex)}
                      className="text-xs h-8 flex-1"
                      placeholder="Add board..."
                      aria-label="New board name"
                    />
                    <Button size="sm" variant="outline" onClick={() => addBoard(selectedIndex)} className="h-8 text-xs">
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Tags</Label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(selected.tags || []).map((tag, ti) => (
                      <Badge key={ti} variant="secondary" className="gap-1 text-[10px]">
                        {tag}
                        <button onClick={() => removeTag(selectedIndex, ti)} className="text-muted-foreground hover:text-foreground" aria-label={`Remove tag ${tag}`}>
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <Input
                      value={selected._newTag || ""}
                      onChange={(e) => update(selectedIndex, "_newTag", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag(selectedIndex)}
                      className="text-xs h-8 flex-1"
                      placeholder="Add tag..."
                      aria-label="New tag name"
                    />
                    <Button size="sm" variant="outline" onClick={() => addTag(selectedIndex)} className="h-8 text-xs">
                      Add
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Changelog</Label>
                  {(selected.changelog || []).map((entry, ei) => (
                    <div key={ei} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">v{entry.version} &mdash; {entry.date}</p>
                        <ul className="list-disc pl-4 mt-1">
                          {entry.changes.map((c, ci) => (
                            <li key={ci} className="text-[10px] text-muted-foreground">{c}</li>
                          ))}
                        </ul>
                      </div>
                      <button onClick={() => removeChangelog(selectedIndex, ei)} className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5" aria-label="Remove changelog entry">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="space-y-1.5 mt-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      <Input
                        value={selected._newChangelogVersion || ""}
                        onChange={(e) => update(selectedIndex, "_newChangelogVersion", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Version (e.g. 2.0.0)"
                        aria-label="Changelog version"
                      />
                      <Input
                        value={selected._newChangelogDate || ""}
                        onChange={(e) => update(selectedIndex, "_newChangelogDate", e.target.value)}
                        className="text-xs h-8"
                        placeholder="Date (e.g. 2026-06-01)"
                        aria-label="Changelog date"
                      />
                    </div>
                    <Input
                      value={selected._newChangelogChange || ""}
                      onChange={(e) => update(selectedIndex, "_newChangelogChange", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addChangelogEntry(selectedIndex)}
                      className="text-xs h-8"
                      placeholder="Change description"
                      aria-label="Change description"
                    />
                    <Button size="sm" variant="outline" onClick={() => addChangelogEntry(selectedIndex)} className="h-8 text-xs">
                      Add Entry
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-xs">Notes</Label>
                  {selected.notes?.map((note, ni) => (
                    <div key={ni} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{note.title}</p>
                        <p className="text-[10px] text-muted-foreground">{note.content}</p>
                      </div>
                      <button onClick={() => removeNote(selectedIndex, ni)} className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5" aria-label="Remove note">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="space-y-1.5 mt-2">
                    <Input
                      value={selected._newNoteTitle || ""}
                      onChange={(e) => update(selectedIndex, "_newNoteTitle", e.target.value)}
                      className="text-xs h-8"
                      placeholder="Note title"
                      aria-label="Note title"
                    />
                    <Textarea
                      value={selected._newNoteContent || ""}
                      onChange={(e) => update(selectedIndex, "_newNoteContent", e.target.value)}
                      className="text-xs min-h-[50px]"
                      placeholder="Note content"
                      aria-label="Note content"
                    />
                    <Button size="sm" variant="outline" onClick={() => addNote(selectedIndex)} className="h-8 text-xs">
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-12">
              <div className="text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Select a project to edit</p>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <Button onClick={generateOutput} className="gap-1.5" disabled={selected !== null && errors.length > 0} aria-label={selected && errors.length > 0 ? "Fix validation errors before exporting" : "Generate projects.json"}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Generate projects.json
            </Button>
            {selected && errors.length > 0 && (
              <p className="text-[10px] text-destructive">Fix validation errors before generating output</p>
            )}
            {jsonOutput && (
              <div className="rounded-lg border border-border">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-xs font-medium">projects.json</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(jsonOutput)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
                <pre className="overflow-x-auto p-3 text-[10px] text-muted-foreground font-mono leading-relaxed max-h-64">
                  {jsonOutput}
                </pre>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">
              Copy the generated JSON and replace the contents of <code className="text-xs text-foreground">src/data/projects.json</code> to apply changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
