import { useState } from 'react'
import { NavLink, Route, Routes, useSearchParams } from 'react-router-dom'
import { StorageProvider, useStorage } from './lib/StorageContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import NewProject from './components/NewProject'
import GithubAuth from './components/GithubAuth'
import type { BoardCategory } from './types/project'
import './App.css'

const CATEGORIES: BoardCategory[] = ['ARDUINO', 'ESP', 'STM32']

function Sidebar() {
  const { mode, githubConfig } = useStorage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showAuth, setShowAuth] = useState(false)

  const activeCategory = (searchParams.get('category') ?? 'all') as BoardCategory | 'all'

  const setCategory = (cat: BoardCategory | 'all') => {
    if (cat === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Flashie</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span>📁</span> Projects
        </NavLink>
        <NavLink to="/new" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span>➕</span> New Project
        </NavLink>
      </nav>

      <div className="sidebar-section-label">Category</div>
      <div className="category-btns">
        <button
          className={`category-btn${activeCategory === 'all' ? ' active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="sidebar-github">
        {showAuth ? (
          <div className="sidebar-auth-inline">
            <GithubAuth onDone={() => setShowAuth(false)} inline />
            <button className="btn btn-sm" onClick={() => setShowAuth(false)}>Cancel</button>
          </div>
        ) : (
          <button
            className={`sidebar-github-status${mode === 'github' && githubConfig ? ' connected' : ''}`}
            onClick={() => setShowAuth(true)}
          >
            <span className={`dot ${mode === 'github' && githubConfig ? 'on' : 'off'}`} />
            {mode === 'github' && githubConfig
              ? `${githubConfig.owner}/${githubConfig.repo}`
              : 'Connect GitHub'}
          </button>
        )}
      </div>
    </aside>
  )
}

function App() {
  return (
    <StorageProvider>
      <ErrorBoundary>
        <div className="app">
          <Sidebar />
          <main className="main">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/project/:category/:id" element={<ProjectDetail />} />
              <Route path="/new" element={<NewProject />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </StorageProvider>
  )
}

export default App
