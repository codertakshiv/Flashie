import type { BoardCategory, FlashManifest, Project, ProjectFile } from '../types/project'

const GITHUB_API = 'https://api.github.com'

const CATEGORIES: BoardCategory[] = ['ARDUINO', 'ESP', 'STM32']

function githubFetch(url: string, token: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'web-flasher',
      ...init?.headers,
    },
  })
}

async function checkResponse(response: Response, context: string) {
  if (response.status === 401) {
    throw new Error(`GitHub authentication failed (401). Check your token.`)
  }
  if (response.status === 404) {
    throw new Error(`GitHub resource not found (404): ${context}`)
  }
  if (response.status === 409 || response.status === 422) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      `GitHub conflict (${response.status})${body.message ? `: ${body.message}` : ''}`,
    )
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      `GitHub API error (${response.status})${body.message ? `: ${body.message}` : ''}`,
    )
  }
}

/* ------------------------------------------------------------------ */
/*  Optional localStorage helpers                                      */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'web-flasher:github-token'

export function saveTokenToLocalStorage(token: string): void {
  localStorage.setItem(STORAGE_KEY, token)
}

export function loadTokenFromLocalStorage(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function clearTokenFromLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/* ------------------------------------------------------------------ */
/*  GithubStorage client                                              */
/* ------------------------------------------------------------------ */

export class GithubStorage {
  private token: string
  private owner: string
  private repo: string
  private branch: string
  private baseFolder: string

  constructor(
    token: string,
    owner: string,
    repo: string,
    branch = 'main',
    baseFolder = '',
  ) {
    this.token = token
    this.owner = owner
    this.repo = repo
    this.branch = branch
    this.baseFolder = baseFolder
  }

  private api(path: string) {
    return `${GITHUB_API}/repos/${this.owner}/${this.repo}/contents/${path}`
  }

  private joinPath(...segments: string[]): string {
    return segments.filter(Boolean).join('/')
  }

  private async get<T>(path: string): Promise<T> {
    const url = `${this.api(path)}?ref=${this.branch}`
    const res = await githubFetch(url, this.token)
    await checkResponse(res, path)
    return res.json()
  }

  private async put(
    path: string,
    content: string,
    message: string,
  ): Promise<void> {
    const url = this.api(path)
    const body: Record<string, string> = {
      message,
      content,
      branch: this.branch,
    }

    const existing = await this.fileExists(path)
    if (existing) {
      body.sha = existing.sha
    }

    const res = await githubFetch(url, this.token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    await checkResponse(res, path)
  }

  private async fileExists(
    path: string,
  ): Promise<{ sha: string } | null> {
    const url = `${this.api(path)}?ref=${this.branch}`
    const res = await githubFetch(url, this.token)

    if (res.status === 404) return null
    if (!res.ok) {
      await checkResponse(res, path)
      return null
    }

    const data = await res.json()
    return { sha: (data as { sha: string }).sha }
  }

  /* ---------------------------------------------------------------- */
  /*  Public API                                                      */
  /* ---------------------------------------------------------------- */

  async listProjects(): Promise<Project[]> {
    type DirEntry = { name: string; type: string; path: string; download_url: string | null }
    type FileEntry = DirEntry & { sha: string; size: number }

    const all: Project[] = []

    for (const category of CATEGORIES) {
      let entries: DirEntry[]

      try {
        entries = await this.get<DirEntry[]>(this.joinPath(this.baseFolder, category))
      } catch {
        continue
      }

      const projectDirs = entries.filter((e) => e.type === 'dir')

      const projects = await Promise.all(
        projectDirs.map(async (dir) => {
          try {
            const files = await this.get<FileEntry[]>(dir.path)

            const manifestFile = files.find((f) => f.name === 'manifest.json')
            if (!manifestFile) return null

            const manifestRes = await fetch(manifestFile.download_url!)
            const manifest: FlashManifest = await manifestRes.json()

            const projectFiles: ProjectFile[] = files
              .filter((f) => f.name.endsWith('.bin') || f.name === 'manifest.json')
              .map((f) => ({
                name: f.name,
                sizeBytes: f.size,
                sha: f.sha,
                downloadUrl: f.download_url ?? undefined,
              }))

            return {
              id: dir.name,
              name: manifest.name,
              category,
              manifest,
              files: projectFiles,
              source: 'github' as const,
              createdAt: '',
            }
          } catch {
            return null
          }
        }),
      )

      all.push(...projects.filter((p) => p !== null) as Project[])
    }

    return all
  }

  async getProjectManifest(category: BoardCategory, projectId: string): Promise<FlashManifest> {
    const data = await this.get<{ download_url: string }>(
      this.joinPath(this.baseFolder, category, projectId, 'manifest.json'),
    )

    const res = await fetch(data.download_url)
    if (!res.ok) {
      throw new Error(`Failed to fetch manifest.json for "${projectId}"`)
    }

    return res.json()
  }

  async uploadProjectFile(
    category: BoardCategory,
    projectId: string,
    fileName: string,
    fileData: ArrayBuffer,
    message: string,
  ): Promise<void> {
    const base64 = btoa(
      new Uint8Array(fileData).reduce(
        (acc, byte) => acc + String.fromCharCode(byte),
        '',
      ),
    )

    await this.put(
      this.joinPath(this.baseFolder, category, projectId, fileName),
      base64,
      message,
    )
  }

  async uploadManifest(
    category: BoardCategory,
    projectId: string,
    manifest: FlashManifest,
    message: string,
  ): Promise<void> {
    const json = JSON.stringify(manifest, null, 2)
    const base64 = btoa(unescape(encodeURIComponent(json)))

    await this.put(
      this.joinPath(this.baseFolder, category, projectId, 'manifest.json'),
      base64,
      message,
    )
  }

  async createProject(
    name: string,
    manifest: FlashManifest,
    category: BoardCategory,
  ): Promise<string> {
    const projectId = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    await this.uploadManifest(category, projectId, manifest, `Create project ${name}`)

    return projectId
  }

  async downloadFile(downloadUrl: string): Promise<ArrayBuffer> {
    const res = await fetch(downloadUrl, {
      headers: { Authorization: `token ${this.token}` },
    })

    if (!res.ok) {
      throw new Error(`Failed to download file (${res.status})`)
    }

    return res.arrayBuffer()
  }
}
