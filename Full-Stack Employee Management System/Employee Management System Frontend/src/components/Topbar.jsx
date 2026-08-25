import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { initials } from '../utils/format.js'
import './Topbar.css'

const TITLES = {
  '/': { title: 'Dashboard', sub: "Here's how the organization looks today." },
  '/employees': { title: 'Employees', sub: 'Browse, search, and manage your team.' },
  '/employees/add': { title: 'Add Employee', sub: 'Bring a new teammate into the system.' },
  '/about': { title: 'About', sub: 'What this project is and how it is built.' },
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const { user } = useAuth()
  const match = TITLES[location.pathname]
  const title = match?.title ?? (location.pathname.endsWith('/edit') ? 'Edit Employee' : 'Employee Profile')
  const sub = match?.sub ?? 'Employee details'

  const [firstName = '', lastName = ''] = (user?.name || '').split(' ')

  return (
    <header className="topbar">
      <button className="topbar__menu" onClick={onMenuClick} aria-label="Open navigation">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      <div>
        <h1 className="topbar__title">{title}</h1>
        <p className="topbar__sub">{sub}</p>
      </div>
      <div className="topbar__spacer" />
      <div className="topbar__profile">
        <span className="topbar__avatar">{initials(firstName, lastName)}</span>
        <div className="topbar__profile-text">
          <p className="topbar__profile-name">{user?.name || 'Account'}</p>
          <p className="topbar__profile-role">{user?.email || ''}</p>
        </div>
      </div>
    </header>
  )
}
