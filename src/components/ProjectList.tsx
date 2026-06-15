import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStorage } from '../lib/StorageContext'
import type { BoardCategory, Project } from '../types/project'

const CATEGORY_COLORS: Record<BoardCategory, string> = {
  ARDUINO: 'var(--accent-mint)',
  ESP: 'var(--accent-lavender)',
  STM32: 'var(--accent-amber)',
}

function ProjectList() {
  const { storage } = useStorage()
  const [searchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeCategory = (searchParams.get('category') ?? 'all') as BoardCategory | 'all'

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

    return () => { cancelled = true }
  }, [storage])

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  const grouped = filtered.reduce<Record<string, Project[]>>((acc, p) => {
    const cat = p.category ?? 'OTHER'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  if (loading) {
    return (
      <section>
        <h1>Projects</h1>
        <p style={{ color: 'var(--text-muted)' }}>Loading projects…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <h1>Projects</h1>
        <div className="flasher-error"><strong>Error loading projects:</strong> {error}</div>
      </section>
    )
  }

  if (filtered.length === 0) {
    return (
      <section>
        <h1>Projects</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          {projects.length === 0 ? 'No projects yet.' : `No projects in this category.`}
        </p>
        <Link to="/new" className="btn btn-primary">New Project</Link>
      </section>
    )
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>
          {activeCategory === 'all' ? 'Projects' : activeCategory}
        </h1>
        <Link to="/new" className="btn btn-primary">New Project</Link>
      </div>

      {Object.entries(grouped).map(([cat, projs]) => (
        <div key={cat} style={{ marginBottom: 28 }}>
          {activeCategory === 'all' && (
            <h2 style={{ fontSize: 15, color: CATEGORY_COLORS[cat as BoardCategory] ?? 'var(--text-muted)', marginBottom: 10 }}>
              {cat}
            </h2>
          )}
          <div className="project-grid">
            {projs.map((p) => {
              const chipFamilies = [...new Set(p.manifest.builds.map((b) => b.chipFamily))]
              const totalSize = p.files.reduce((s, f) => s + f.sizeBytes, 0)
              const catLabel = p.category ?? 'OTHER'
              return (
                <div key={p.id} className="project-card">
                  <div className={`category-pill ${catLabel}`}>{catLabel}</div>
                  <h3 className="project-card-title">{p.name}</h3>
                  <div className="project-card-meta">
                    <span>Chip: {chipFamilies.join(', ')}</span>
                    <span>Files: {p.files.length} ({(totalSize / 1024).toFixed(1)} KB)</span>
                  </div>
                  <Link
                    to={`/project/${catLabel}/${p.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ alignSelf: 'flex-start', textDecoration: 'none' }}
                  >
                    Flash
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

export default ProjectList
