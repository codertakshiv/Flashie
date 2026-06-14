export interface FirmwareFile {
  path: string;
  offset: string;
}

export interface BuildConfig {
  chipFamily: string;
  parts: FirmwareFile[];
}

export interface ManifestData {
  name: string;
  version: string;
  builds?: BuildConfig[];
  new_install_prompt_erase?: boolean;
  funding_url?: string;
  home_assistant_domain?: string;
}

export interface ProjectNote {
  title: string;
  content: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export type ProjectStatus = "Stable" | "Beta" | "Experimental" | "Deprecated" | "Development";

export interface Project {
  id: string;
  name: string;
  description: string;
  version: string;
  boards: string[];
  manifestPath: string;
  githubUrl?: string;
  docsUrl?: string;
  tutorialUrl?: string;
  tags?: string[];
  lastUpdated?: string;
  notes?: ProjectNote[];
  changelog?: ChangelogEntry[];
  featured?: boolean;
  status?: ProjectStatus;
  screenshot?: string;
  downloads?: number;
}

export interface ProjectsData {
  projects: Project[];
}

export type EditableField = keyof Pick<
  Project,
  "id" | "name" | "description" | "version" | "manifestPath" | "githubUrl" | "docsUrl" | "tutorialUrl" | "status" | "screenshot" | "downloads"
>;

export interface EditableProject extends Project {
  _newBoard?: string;
  _newNoteTitle?: string;
  _newNoteContent?: string;
  _newTag?: string;
  _newChangelogVersion?: string;
  _newChangelogDate?: string;
  _newChangelogChange?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
