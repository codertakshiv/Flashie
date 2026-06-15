import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { StorageProvider, useStorage } from './lib/StorageContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import NewProject from './components/NewProject'
import GithubAuth from './components/GithubAuth'
import './App.css'

function Nav() {
  const { mode, githubConfig } = useStorage()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <nav className="nav">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/new">New Project</Link>
        </div>
        <button className="github-btn" type="button" onClick={() => setShowAuth((v) => !v)}>
          {mode === 'github' && githubConfig
            ? `${githubConfig.owner}/${githubConfig.repo}`
            : 'Connect GitHub'}
        </button>
      </nav>
      {showAuth && (
        <div className="nav-auth-wrapper">
          <GithubAuth onDone={() => setShowAuth(false)} />
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <StorageProvider>
      <ErrorBoundary>
        <div className="app">
          <Nav />
          <main className="main">
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/new" element={<NewProject />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </StorageProvider>
  )
}

export default App
