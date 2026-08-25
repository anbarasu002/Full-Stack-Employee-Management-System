import './AuthLayout.css'

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-brand-panel">
        <div className="auth-brand-panel__content">
          <span className="auth-brand-mark" aria-hidden="true">
            <span className="auth-brand-mark-core" />
            <span className="auth-brand-mark-ring" />
          </span>
          <h1>Employee Management System</h1>
          <p>A calmer way to run your workforce — one clean dashboard for every employee record.</p>

          <ul className="auth-brand-list">
            <li>Centralized employee directory</li>
            <li>Live headcount &amp; department insights</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
