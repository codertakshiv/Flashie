import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChipFamily } from '../types/project'
import { useStorage } from '../lib/StorageContext'
import { buildManifest, DEFAULT_OFFSETS, validateManifest } from '../lib/manifest'

const CHIP_FAMILIES: ChipFamily[] = ['ESP32', 'ESP32-S2', 'ESP32-S3', 'ESP32-C3', 'ESP8266']

interface FileEntry {
  file: File
  offset: number
}

function formatHex(val: number): string {
  return `0x${val.toString(16).toUpperCase().padStart(8, '0')}`
}

function parseHex(val: string): number | null {
  const s = val.trim()
  if (s.startsWith('0x') || s.startsWith('0X')) {
    const n = parseInt(s, 16)
    return Number.isNaN(n) ? null : n
  }
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? null : n
}

function ProjectUpload() {
  const { storage, mode, githubConfig } = useStorage()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---------- form state ---------- */
  const [name, setName] = useState('')
  const [version, setVersion] = useState('')
  const [chipFamily, setChipFamily] = useState<ChipFamily>('ESP32')
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  /* ---------- file helpers ---------- */
  const addFiles = useCallback(
    (incoming: File[]) => {
      const bins = incoming.filter((f) => f.name.endsWith('.bin'))
      if (bins.length === 0) return

      setFileEntries((prev) => {
        const existing = new Set(prev.map((e) => e.file.name))
        const newEntries = bins
          .filter((f) => !existing.has(f.name))
          .map((file) => ({ file, offset: DEFAULT_OFFSETS[chipFamily] }))
        return [...prev, ...newEntries]
      })
    },
    [chipFamily],
  )

  const removeFile = useCallback((name: string) => {
    setFileEntries((prev) => prev.filter((e) => e.file.name !== name))
  }, [])

  const updateOffset = useCallback((name: string, raw: string) => {
    const val = parseHex(raw)
    if (val === null || val < 0) return
    setFileEntries((prev) =>
      prev.map((e) => (e.file.name === name ? { ...e, offset: val } : e)),
    )
  }, [])

  /* ---------- drag / drop ---------- */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      addFiles(Array.from(e.dataTransfer.files))
    },
    [addFiles],
  )

  /* ---------- create ---------- */
  const handleCreate = useCallback(async () => {
    setErrors([])

    const manifest = buildManifest(
      name || 'Untitled',
      version || '1.0.0',
      chipFamily,
      fileEntries,
    )

    const validationErrors = validateManifest(manifest)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setUploading(true)
    setUploadProgress('Creating project…')

    try {
      const projectId = await storage.createProject(name || 'Untitled', manifest)

      for (let i = 0; i < fileEntries.length; i++) {
        const { file } = fileEntries[i]
        setUploadProgress(`Uploading ${file.name} (${i + 1}/${fileEntries.length})…`)
        const data = await file.arrayBuffer()
        await storage.uploadProjectFile(
          projectId,
          file.name,
          data,
          `Add firmware file: ${file.name}`,
        )
      }

      setUploadProgress('Saving manifest…')
      await storage.uploadManifest(projectId, manifest, 'Add manifest')

      navigate(`/project/${projectId}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrors([msg])
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }, [name, version, chipFamily, fileEntries, storage, navigate])

  const needsGitHubAuth = mode === 'github' && !githubConfig

  return (
    <section className="upload-form">
      <h1>New Project</h1>

      {/* ---------- GitHub auth gate ---------- */}
      {needsGitHubAuth && (
        <div className="flasher-warning" style={{ marginBottom: 16 }}>
          <strong>GitHub token required</strong>
          <p style={{ marginTop: 8, fontSize: 14 }}>
            Storage mode is set to GitHub but no token is configured.
            Use the "Connect GitHub" button in the navigation bar to set up
            authentication before creating a project.
          </p>
        </div>
      )}

      {/* ---------- project details ---------- */}
      <div className="upload-field">
        <label htmlFor="proj-name">Project name</label>
        <input
          id="proj-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={uploading}
        />
      </div>

      <div className="upload-field">
        <label htmlFor="proj-version">Version</label>
        <input
          id="proj-version"
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="1.0.0"
          disabled={uploading}
        />
      </div>

      <div className="upload-field">
        <label htmlFor="proj-chip">Chip family</label>
        <select
          id="proj-chip"
          value={chipFamily}
          onChange={(e) => {
            const cf = e.target.value as ChipFamily
            setChipFamily(cf)
            setFileEntries((prev) =>
              prev.map((e) => ({ ...e, offset: DEFAULT_OFFSETS[cf] })),
            )
          }}
          disabled={uploading}
        >
          {CHIP_FAMILIES.map((cf) => (
            <option key={cf} value={cf}>
              {cf}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- drag & drop ---------- */}
      <div
        className={`upload-dropzone ${dragOver ? 'upload-dropzone--over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {dragOver ? (
          <p>Drop .bin files here</p>
        ) : (
          <p>Drag & drop .bin files here, or click to browse</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".bin"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(Array.from(e.target.files))
            e.target.value = ''
          }}
        />
      </div>

      {/* ---------- file list ---------- */}
      {fileEntries.length > 0 && (
        <div className="upload-file-list">
          <h2>Firmware files</h2>
          {fileEntries.map((entry) => (
            <div key={entry.file.name} className="upload-file-row">
              <span className="upload-file-name">{entry.file.name}</span>
              <span className="upload-file-size">
                {(entry.file.size / 1024).toFixed(1)} KB
              </span>
              <label>
                Offset
                <input
                  type="text"
                  className="upload-offset-input"
                  value={formatHex(entry.offset)}
                  onChange={(e) => updateOffset(entry.file.name, e.target.value)}
                  disabled={uploading}
                />
              </label>
              <button
                type="button"
                className="flasher-btn flasher-btn-secondary"
                style={{ padding: '4px 10px', fontSize: 13 }}
                onClick={() => removeFile(entry.file.name)}
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- errors ---------- */}
      {errors.length > 0 && (
        <div className="flasher-error">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

      {/* ---------- progress ---------- */}
      {uploadProgress && (
        <div className="upload-progress">{uploadProgress}</div>
      )}

      {/* ---------- create button ---------- */}
      <button
        type="button"
        className="flasher-btn"
        style={{ marginTop: 8 }}
        onClick={handleCreate}
        disabled={uploading || fileEntries.length === 0 || needsGitHubAuth}
      >
        {uploading ? 'Creating…' : 'Create Project'}
      </button>
    </section>
  )
}

export default ProjectUpload
