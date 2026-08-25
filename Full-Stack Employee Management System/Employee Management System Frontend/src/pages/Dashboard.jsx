import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import employeeService from '../services/employeeService.js'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { initials } from '../utils/format.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    employeeService
      .getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.friendlyMessage))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) return <Loader label="Loading dashboard…" />
  if (error) return <ErrorState message={error} onRetry={load} />

  const departmentEntries = Object.entries(stats.employeesByDepartment || {})
  const maxDeptCount = Math.max(1, ...departmentEntries.map(([, count]) => count))

  return (
    <div>
      <div className="stat-grid">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          accent="#3644e0"
          accentBg="#f2f3ff"
          icon={<PeopleGlyph />}
        />
        <StatCard
          label="Active Employees"
          value={stats.activeEmployees}
          accent="#0e9f8b"
          accentBg="#d9f5ef"
          icon={<CheckGlyph />}
        />
        <StatCard
          label="Inactive Employees"
          value={stats.inactiveEmployees}
          accent="#e5484d"
          accentBg="#fde3e4"
          icon={<PauseGlyph />}
        />
        <StatCard
          label="Departments"
          value={stats.totalDepartments}
          accent="#d97706"
          accentBg="#fef1d6"
          icon={<GridGlyph />}
        />
      </div>

      <div className="dash-grid">
        <div className="card card-pad">
          <div className="dash-card__header">
            <h3>Recently Added</h3>
            <Link to="/employees" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          {stats.recentEmployees?.length ? (
            <ul className="recent-list">
              {stats.recentEmployees.map((emp) => (
                <li key={emp.id}>
                  <Link to={`/employees/${emp.id}`} className="recent-list__row">
                    <span className="cell-avatar">{initials(emp.firstName, emp.lastName)}</span>
                    <div className="cell-name-text">
                      <p>
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="mono">{emp.id} · {emp.department}</p>
                    </div>
                    <StatusBadge status={emp.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty">No employees yet.</p>
          )}
        </div>

        <div className="card card-pad">
          <div className="dash-card__header">
            <h3>Headcount by Department</h3>
          </div>
          {departmentEntries.length ? (
            <div className="dept-bars">
              {departmentEntries.map(([dept, count]) => (
                <div className="dept-bar" key={dept}>
                  <div className="dept-bar__label">
                    <span>{dept}</span>
                    <span className="mono">{count}</span>
                  </div>
                  <div className="dept-bar__track">
                    <div
                      className="dept-bar__fill"
                      style={{ width: `${(count / maxDeptCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dash-empty">No department data yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function PeopleGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="6" cy="5" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.8 14c.4-2.8 2-4.3 4.2-4.3S10.2 11.2 10.6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 6a2 2 0 100-4 2 2 0 000 4zM11.5 9.9c1.9.3 3 1.6 3.3 4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function CheckGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8.7l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PauseGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 6v5M10 6v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function GridGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="2" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
