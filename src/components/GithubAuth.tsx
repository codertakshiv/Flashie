import { useState } from 'react'
import { useStorage } from '../lib/StorageContext'
import {
  saveTokenToLocalStorage,
  loadTokenFromLocalStorage,
  clearTokenFromLocalStorage,
} from '../lib/github'

interface GithubAuthProps {
  onDone?: () => void
  inline?: boolean
}

function GithubAuth({ onDone, inline }: GithubAuthProps) {
  const { setGithub, setLocal } = useStorage()

  const [token, setToken] = useState(loadTokenFromLocalStorage() ?? '')
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [branch, setBranch] = useState('main')
  const [remember, setRemember] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)

  const handleConnect = async () => {
    setError(null)
    setConnecting(true)

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'web-flasher',
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Token is invalid or expired. Generate a new one at GitHub Settings.')
        }
        throw new Error(`GitHub API responded with ${res.status}`)
      }

      const data = await res.json()
      setUser(data.login)

      await setGithub({ token, owner, repo, branch })

      if (remember) {
        saveTokenToLocalStorage(token)
      } else {
        clearTokenFromLocalStorage()
      }

      onDone?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setConnecting(false)
    }
  }

  const content = (
    <>
      {!inline && <h2>Connect to GitHub</h2>}

      <p className="github-auth-help">
        Create a{' '}
        <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
          Personal Access Token
        </a>{' '}
        with <strong>repo</strong> scope (or fine-grained{' '}
        <strong>Contents: Read and write</strong>).
      </p>

      <div className="upload-field">
        <label htmlFor="gh-token">Personal Access Token</label>
        <div className="pat-wrapper">
          <input
            id="gh-token"
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="github_pat_…"
            disabled={connecting}
          />
          <button
            type="button"
            className="pat-toggle"
            onClick={() => setShowToken((v) => !v)}
            tabIndex={-1}
            aria-label={showToken ? 'Hide token' : 'Show token'}
          >
            {showToken ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="upload-field">
        <label htmlFor="gh-owner">Repository owner</label>
        <input
          id="gh-owner"
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="e.g. your-username"
          disabled={connecting}
        />
      </div>

      <div className="upload-field">
        <label htmlFor="gh-repo">Repository name</label>
        <input
          id="gh-repo"
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="e.g. my-flash-repo"
          disabled={connecting}
        />
      </div>

      <div className="upload-field">
        <label htmlFor="gh-branch">Branch</label>
        <input
          id="gh-branch"
          type="text"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          disabled={connecting}
        />
      </div>

      <label className="github-auth-remember">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          disabled={connecting}
        />
        <span>Remember on this device (trusted devices only)</span>
      </label>

      {error && <div className="flasher-error">{error}</div>}

      {user && (
        <div style={{ fontSize: 13, color: 'var(--accent-mint)', marginTop: 4 }}>
          Authenticated as <strong>{user}</strong>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 4, alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleConnect}
          disabled={connecting || !token || !owner || !repo}
        >
          {connecting ? 'Connecting…' : 'Connect'}
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => {
            setLocal()
            onDone?.()
          }}
        >
          Use local mode
        </button>
      </div>
    </>
  )

  if (inline) {
    return <>{content}</>
  }

  return <section className="github-auth card">{content}</section>
}

export default GithubAuth
