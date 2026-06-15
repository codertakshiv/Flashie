import { useState } from 'react'
import { useStorage } from '../lib/StorageContext'
import {
  saveTokenToLocalStorage,
  loadTokenFromLocalStorage,
  clearTokenFromLocalStorage,
} from '../lib/github'

interface GithubAuthProps {
  onDone?: () => void
}

function GithubAuth({ onDone }: GithubAuthProps) {
  const { setGithub, setLocal } = useStorage()

  const [token, setToken] = useState(loadTokenFromLocalStorage() ?? '')
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [branch, setBranch] = useState('main')
  const [remember, setRemember] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <section className="github-auth">
      <h2>Connect to GitHub</h2>

      <p className="github-auth-help">
        Create a{' '}
        <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
          Personal Access Token
        </a>{' '}
        with <strong>repo</strong> scope (or a fine-grained token with{' '}
        <strong>Contents: Read and write</strong> permission on the target
        repository).
      </p>

      <div className="upload-field">
        <label htmlFor="gh-token">Personal Access Token</label>
        <input
          id="gh-token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_…"
          disabled={connecting}
        />
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
        <span>
          Remember on this device (stored in browser localStorage — only do this
          on trusted devices)
        </span>
      </label>

      {error && <div className="flasher-error">{error}</div>}

      {user && (
        <div className="flasher-chip-info" style={{ marginTop: 8 }}>
          Authenticated as <strong>{user}</strong>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
        <button
          type="button"
          className="flasher-btn"
          onClick={handleConnect}
          disabled={connecting || !token || !owner || !repo}
        >
          {connecting ? 'Connecting…' : 'Connect'}
        </button>

        <button
          type="button"
          className="flasher-btn flasher-btn-secondary"
          onClick={() => {
            setLocal()
            onDone?.()
          }}
        >
          Use local mode instead
        </button>
      </div>
    </section>
  )
}

export default GithubAuth
