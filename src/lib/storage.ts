import type { FlashManifest, Project, ProjectFile } from '../types/project'

/* ------------------------------------------------------------------ */
/*  StorageAdapter interface                                           */
/* ------------------------------------------------------------------ */

export interface StorageAdapter {
  listProjects(): Promise<Project[]>
  getProjectManifest(id: string): Promise<FlashManifest>
  uploadProjectFile(
    id: string,
    fileName: string,
    data: ArrayBuffer,
    message: string,
  ): Promise<void>
  uploadManifest(
    id: string,
    manifest: FlashManifest,
    message: string,
  ): Promise<void>
  createProject(name: string, manifest: FlashManifest): Promise<string>
  downloadFile(ref: string): Promise<ArrayBuffer>
}

/* ------------------------------------------------------------------ */
/*  LocalStorageAdapter                                                */
/* ------------------------------------------------------------------ */

interface LocalProjectEntry {
  manifest: FlashManifest
  files: Map<string, ArrayBuffer>
}

export class LocalStorageAdapter implements StorageAdapter {
  private projects: Map<string, LocalProjectEntry> = new Map()

  async listProjects(): Promise<Project[]> {
    const result: Project[] = []
    for (const [id, entry] of this.projects) {
      const files: ProjectFile[] = []
      for (const [name, data] of entry.files) {
        files.push({
          name,
          sizeBytes: data.byteLength,
          data,
        })
      }
      result.push({
        id,
        name: entry.manifest.name,
        manifest: entry.manifest,
        files,
        source: 'local',
        createdAt: '',
      })
    }
    return result
  }

  async getProjectManifest(id: string): Promise<FlashManifest> {
    const entry = this.projects.get(id)
    if (!entry) {
      throw new Error(`Project "${id}" not found in local storage`)
    }
    return entry.manifest
  }

  async uploadProjectFile(
    id: string,
    fileName: string,
    data: ArrayBuffer,
    _message: string,
  ): Promise<void> {
    const entry = this.projects.get(id)
    if (!entry) {
      throw new Error(`Project "${id}" not found in local storage`)
    }
    entry.files.set(fileName, data)
  }

  async uploadManifest(
    id: string,
    manifest: FlashManifest,
    _message: string,
  ): Promise<void> {
    const entry = this.projects.get(id)
    if (!entry) {
      throw new Error(`Project "${id}" not found in local storage`)
    }
    entry.manifest = manifest
  }

  async createProject(
    name: string,
    manifest: FlashManifest,
  ): Promise<string> {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    this.projects.set(id, { manifest, files: new Map() })
    return id
  }

  async downloadFile(ref: string): Promise<ArrayBuffer> {
    const parts = ref.split('/')
    const projectId = parts[0]
    const fileName = parts.slice(1).join('/')
    const entry = this.projects.get(projectId)
    if (!entry) {
      throw new Error(`Project "${projectId}" not found`)
    }
    const data = entry.files.get(fileName)
    if (!data) {
      throw new Error(`File "${fileName}" not found in project "${projectId}"`)
    }
    return data
  }
}

/* ------------------------------------------------------------------ */
/*  Factory                                                            */
/* ------------------------------------------------------------------ */

export function getStorageAdapter(
  mode: 'github',
  config: { token: string; owner: string; repo: string; branch?: string },
): StorageAdapter
export function getStorageAdapter(
  mode: 'local',
  config?: undefined,
): StorageAdapter
export function getStorageAdapter(
  mode: 'github',
  config: { token: string; owner: string; repo: string; branch?: string },
): Promise<StorageAdapter>
export function getStorageAdapter(
  mode: 'local',
  config?: undefined,
): StorageAdapter
export function getStorageAdapter(
  mode: 'github' | 'local',
  config?: { token: string; owner: string; repo: string; branch?: string },
): Promise<StorageAdapter> | StorageAdapter {
  if (mode === 'github') {
    const { token, owner, repo, branch } = config!
    return import('./github').then(
      ({ GithubStorage }) =>
        new GithubStorage(token, owner, repo, branch) as StorageAdapter,
    )
  }
  return new LocalStorageAdapter()
}
