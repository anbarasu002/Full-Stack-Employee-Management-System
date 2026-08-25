import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import employeeService from '../services/employeeService.js'
import { DEPARTMENTS } from '../components/EmployeeForm.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import { initials, formatCurrency } from '../utils/format.js'

export default function EmployeeList() {
  const navigate = useNavigate()
  const location = useLocation()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(
    location.state?.toast ? { type: 'success', message: location.state.toast } : null,
  )

  const load = () => {
    setLoading(true)
    setError('')
    employeeService
      .getAll()
      .then((res) => setEmployees(res.data))
      .catch((err) => setError(err.friendlyMessage))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesQuery =
        !q ||
        e.id.toLowerCase().includes(q) ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      const matchesDept = department === 'All' || e.department === department
      const matchesStatus = status === 'All' || e.status === status
      return matchesQuery && matchesDept && matchesStatus
    })
  }, [employees, query, department, status])

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await employeeService.remove(pendingDelete.id)
      setEmployees((prev) => prev.filter((e) => e.id !== pendingDelete.id))
      setToast({ type: 'success', message: `${pendingDelete.firstName} ${pendingDelete.lastName} was deleted.` })
      setPendingDelete(null)
    } catch (err) {
      setToast({ type: 'error', message: err.friendlyMessage })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">Directory</span>
          <h2>All Employees</h2>
          <p>{employees.length} total employees on record</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      <div className="toolbar">
        <div className="search-input">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, name, email, or department…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="select-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select className="select-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <Loader label="Loading employees…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        employees.length === 0 ? (
          <EmptyState actionTo="/employees/add" actionLabel="+ Add Employee" />
        ) : (
          <EmptyState title="No matches." message="Try a different search term or filter." />
        )
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="cell-name">
                      <span className="cell-avatar">{initials(emp.firstName, emp.lastName)}</span>
                      <div className="cell-name-text">
                        <p>
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p>{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="mono">{emp.id}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{formatCurrency(emp.salary)}</td>
                  <td>
                    <StatusBadge status={emp.status} />
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-secondary btn-icon"
                        title="View"
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon"
                        title="Edit"
                        onClick={() => navigate(`/employees/${emp.id}/edit`)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon"
                        title="Delete"
                        onClick={() => setPendingDelete(emp)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete employee"
          message={`Are you sure you want to delete ${pendingDelete.firstName} ${pendingDelete.lastName} (${pendingDelete.id})? This action cannot be undone.`}
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 7.5S3.5 3 7.5 3s6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10 2.3l2.7 2.7L4.8 12.9 2 13.5l.6-2.8L10 2.3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 4h10M5.8 4V2.6h3.4V4M6 6.6v4.4M9 6.6v4.4M3.5 4l.6 8.2a1 1 0 001 .9h4.8a1 1 0 001-.9l.6-8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
