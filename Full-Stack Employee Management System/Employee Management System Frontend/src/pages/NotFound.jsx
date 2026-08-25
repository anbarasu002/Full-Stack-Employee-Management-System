import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="state-block" style={{ paddingTop: 96 }}>
      <span className="eyebrow">404</span>

      <h3>Page not found</h3>

      <p>
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <div style={{ marginTop: 20 }}>
        <div className="loading-spinner"></div>

        <p style={{ marginTop: 10 }}>
          Redirecting to dashboard...
        </p>
      </div>

      <Link
        to="/"
        className="btn btn-primary btn-sm"
        style={{ marginTop: 10 }}
      >
        Back to dashboard
      </Link>
    </div>
  )
}