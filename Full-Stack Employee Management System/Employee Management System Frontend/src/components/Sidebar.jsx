import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true, icon: DashboardIcon },
  { to: '/employees', label: 'Employees', end: false, icon: PeopleIcon },
  { to: '/employees/add', label: 'Add Employee', end: true, icon: AddIcon },
  { to: '/about', label: 'About', end: true, icon: InfoIcon },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__mark" aria-hidden="true">
          <span className="sidebar__mark-core" />
          <span className="sidebar__mark-ring" />
        </span>
        <div>
          <p className="sidebar__brand-name">Employee Management System</p>
          <p className="sidebar__brand-tag">Workforce console</p>
        </div>
        <button className="sidebar__close" onClick={onClose} aria-label="Close navigation">
          ×
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, end, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}

        <button className="sidebar__link sidebar__logout" onClick={handleLogout} disabled={loggingOut}>
          <LogoutIcon />
          <span>{loggingOut ? 'Logging out…' : 'Logout'}</span>
        </button>
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__footer-title">{user?.name || 'Signed in'}</p>
        <p className="sidebar__footer-sub">{user?.email || 'React + Vite ⟶ Spring Boot ⟶ in-memory store'}</p>
      </div>
    </aside>
  )
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="2" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="8" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2" y="11" width="6" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="6.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 15c.5-3 2.2-4.5 4.5-4.5S10.5 12 11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11.5 15c.4-2.2 1.6-3.4 3.3-3.4S17.6 12.8 18 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8.2v4.3M9 5.8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 12.5L15 9l-3.5-3.5M15 9H6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
