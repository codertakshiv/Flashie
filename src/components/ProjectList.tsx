import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStorage } from '../lib/StorageContext'
import type { Project } from '../types/project'

function ProjectList() {
  const { storage } = useStorage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    storage
      .listProjects()
      .then((list) => {
        if (!cancelled) {
          setProjects(list)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [storage])

  if (loading) {
    return (
      <section>
        <h1>Projects</h1>
        <p>Loading projects…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h1>Projects</h1>
        <div className="flasher-error">
          <strong>Error loading projects:</strong> {error}
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section>
        <h1>Projects</h1>
        <p>No projects yet.</p>
        <Link to="/new" className="flasher-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
          New Project
        </Link>
      </section>
    )
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Projects</h1>
        <Link to="/new" className="flasher-btn" style={{ textDecoration: 'none' }}>
          New Project
        </Link>
      </div>
      <div className="project-grid">
        {projects.map((p) => {
          const chipFamilies = [...new Set(p.manifest.builds.map((b) => b.chipFamily))]
          return (
            <div key={p.id} className="project-card">
              <h2 className="project-card-title">{p.name}</h2>
              <div className="project-card-meta">
                <span>Chip: {chipFamilies.join(', ')}</span>
                <span>Files: {p.files.length}</span>
              </div>
              <Link
                to={`/project/${p.id}`}
                className="flasher-btn"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Flash
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectList
