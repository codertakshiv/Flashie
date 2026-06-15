import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { LocalStorageAdapter, getStorageAdapter, type StorageAdapter } from './storage'

type GithubConfig = { token: string; owner: string; repo: string; branch?: string }

interface StorageContextValue {
  storage: StorageAdapter
  mode: 'github' | 'local'
  githubConfig: GithubConfig | null
  setGithub: (config: GithubConfig) => Promise<void>
  setLocal: () => void
}

const StorageContext = createContext<StorageContextValue | null>(null)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'github' | 'local'>('local')
  const [storage, setStorage] = useState<StorageAdapter>(new LocalStorageAdapter())
  const [githubConfig, setGithubConfig] = useState<GithubConfig | null>(null)

  const setGithub = useCallback(async (config: GithubConfig) => {
    const adapter = await getStorageAdapter('github', config)
    setStorage(adapter)
    setGithubConfig(config)
    setMode('github')
  }, [])

  const setLocal = useCallback(() => {
    setStorage(new LocalStorageAdapter())
    setGithubConfig(null)
    setMode('local')
  }, [])

  return (
    <StorageContext.Provider value={{ storage, mode, githubConfig, setGithub, setLocal }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage(): StorageContextValue {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage must be used within StorageProvider')
  return ctx
}
