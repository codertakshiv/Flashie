import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <div className="flasher-error">
            <strong>Error:</strong> {this.state.error?.message ?? 'Unknown error'}
          </div>
          <button
            type="button"
            className="flasher-btn"
            style={{ marginTop: 16 }}
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = '/'
            }}
          >
            Return home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
