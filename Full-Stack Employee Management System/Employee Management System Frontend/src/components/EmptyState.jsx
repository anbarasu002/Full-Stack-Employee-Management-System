import { Link } from 'react-router-dom'

export default function EmptyState({
  title = 'No employees found.',
  message = 'Add your first employee to get started.',
  actionTo,
  actionLabel,
}) {
  return (
    <div className="state-block">
      <span className="state-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 19c.6-4 3-6 5.5-6s4.9 2 5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 4l4 4M20 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionTo && (
        <Link to={actionTo} className="btn btn-primary btn-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
