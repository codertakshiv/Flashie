import type { BoardCategory, FlashManifest, Project, ProjectFile } from '../types/project'

/* ------------------------------------------------------------------ */
/*  StorageAdapter interface                                           */
/* ------------------------------------------------------------------ */

export interface StorageAdapter {
  listProjects(): Promise<Project[]>
  getProjectManifest(category: BoardCategory, id: string): Promise<FlashManifest>
  uploadProjectFile(
    category: BoardCategory,
    id: string,
    fileName: string,
    data: ArrayBuffer,
    message: string,
  ): Promise<void>
  uploadManifest(
    category: BoardCategory,
    id: string,
    manifest: FlashManifest,
    message: string,
  ): Promise<void>
  createProject(name: string, manifest: FlashManifest, category: BoardCategory): Promise<string>
  downloadFile(ref: string): Promise<ArrayBuffer>
}

/* ------------------------------------------------------------------ */
/*  LocalStorageAdapter                                                */
/* ------------------------------------------------------------------ */

interface LocalProjectEntry {
  category: BoardCategory
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
        category: entry.category,
        manifest: entry.manifest,
        files,
        source: 'local',
        createdAt: '',
      })
    }
    return result
  }

  async getProjectManifest(category: BoardCategory, id: string): Promise<FlashManifest> {
    const key = `${category}/${id}`
    const entry = this.projects.get(key)
    if (!entry) {
      throw new Error(`Project "${key}" not found in local storage`)
    }
    return entry.manifest
  }

  async uploadProjectFile(
    category: BoardCategory,
    id: string,
    fileName: string,
    data: ArrayBuffer,
    _message: string,
  ): Promise<void> {
    const key = `${category}/${id}`
    const entry = this.projects.get(key)
    if (!entry) {
      throw new Error(`Project "${key}" not found in local storage`)
    }
    entry.files.set(fileName, data)
  }

  async uploadManifest(
    category: BoardCategory,
    id: string,
    manifest: FlashManifest,
    _message: string,
  ): Promise<void> {
    const key = `${category}/${id}`
    const entry = this.projects.get(key)
    if (!entry) {
      throw new Error(`Project "${key}" not found in local storage`)
    }
    entry.manifest = manifest
  }

  async createProject(
    name: string,
    manifest: FlashManifest,
    category: BoardCategory,
  ): Promise<string> {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const key = `${category}/${id}`
    this.projects.set(key, { category, manifest, files: new Map() })
    return id
  }

  async downloadFile(ref: string): Promise<ArrayBuffer> {
    const parts = ref.split('/')
    const category = parts[0] as BoardCategory
    const projectId = parts[1]
    const fileName = parts.slice(2).join('/')
    const key = `${category}/${projectId}`
    const entry = this.projects.get(key)
    if (!entry) {
      throw new Error(`Project "${key}" not found`)
    }
    const data = entry.files.get(fileName)
    if (!data) {
      throw new Error(`File "${fileName}" not found in project "${key}"`)
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
