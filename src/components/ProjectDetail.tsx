import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStorage } from '../lib/StorageContext'
import FlasherPanel from './FlasherPanel'
import type { FlashManifest } from '../types/project'

function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { storage, mode } = useStorage()

  const [manifest, setManifest] = useState<FlashManifest | null>(null)
  const [fileMap, setFileMap] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    storage
      .getProjectManifest(id)
      .then((m) => {
        if (!cancelled) setManifest(m)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })

    storage
      .listProjects()
      .then((projects) => {
        if (cancelled) return
        const project = projects.find((p) => p.id === id)
        if (project) {
          const map = new Map<string, string>()
          for (const f of project.files) {
            if (f.downloadUrl) map.set(f.name, f.downloadUrl)
          }
          if (!cancelled) setFileMap(map)
        }
      })
      .catch(() => {
        /* non-critical — file download URLs may be absent */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, storage])

  const getFileData = useCallback(
    async (path: string): Promise<ArrayBuffer> => {
      if (mode === 'local') {
        return storage.downloadFile(`${id}/${path}`)
      }
      const url = fileMap.get(path)
      if (!url) throw new Error(`No download URL available for "${path}"`)
      return storage.downloadFile(url)
    },
    [mode, id, storage, fileMap],
  )

  if (loading) {
    return (
      <section>
        <p>
          <Link to="/">← Back to projects</Link>
        </p>
        <p>Loading project…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <p>
          <Link to="/">← Back to projects</Link>
        </p>
        <div className="flasher-error">
          <strong>Error:</strong> {error}
        </div>
      </section>
    )
  }

  if (!manifest) {
    return (
      <section>
        <p>
          <Link to="/">← Back to projects</Link>
        </p>
        <p>Project not found.</p>
      </section>
    )
  }

  const chipFamilies = [...new Set(manifest.builds.map((b) => b.chipFamily))]

  return (
    <section>
      <p>
        <Link to="/">← Back to projects</Link>
      </p>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '8px 0' }}>{manifest.name}</h1>
        <p style={{ color: 'var(--text)', fontSize: 14 }}>
          v{manifest.version} &middot; {chipFamilies.join(', ')}
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2>Files</h2>
        <table className="file-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Offset</th>
            </tr>
          </thead>
          <tbody>
            {manifest.builds.map((build) =>
              build.parts.map((part, idx) => (
                <tr key={`${build.chipFamily}-${idx}`}>
                  <td>{part.path}</td>
                  <td>—</td>
                  <td>
                    <code>0x{part.offset.toString(16).toUpperCase().padStart(8, '0')}</code>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>

      {manifest.builds.length > 0 && (
        <FlasherPanel manifest={manifest} getFileData={getFileData} />
      )}
    </section>
  )
}

export default ProjectDetail
