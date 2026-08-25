import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import employeeService from '../services/employeeService.js'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import { initials, formatCurrency, formatDate } from '../utils/format.js'

export default function ViewEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(location.state?.toast ? { type: 'success', message: location.state.toast } : null)

  const load = () => {
    setLoading(true)
    setError('')
    employeeService
      .getById(id)
      .then((res) => setEmployee(res.data))
      .catch((err) => setError(err.friendlyMessage))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await employeeService.remove(id)
      navigate('/employees', { state: { toast: `${employee.firstName} ${employee.lastName} was deleted.` } })
    } catch (err) {
      setToast({ type: 'error', message: err.friendlyMessage })
      setDeleting(false)
      setConfirmingDelete(false)
    }
  }

  if (loading) return <Loader label="Loading employee…" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <Link to="/employees" className="back-link">
        ← Back to employees
      </Link>

      <div className="detail-header">
        <span className="detail-avatar">{initials(employee.firstName, employee.lastName)}</span>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20 }}>
            {employee.firstName} {employee.lastName}
          </h2>
          <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 3 }}>
            {employee.position} · {employee.department}
          </p>
        </div>
        <StatusBadge status={employee.status} />
        <div className="row-actions">
          <Link to={`/employees/${id}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
        </div>
      </div>

      <div className="card card-pad">
        <div className="detail-grid">
          <Field label="Employee ID" value={employee.id} mono />
          <Field label="Status" value={employee.status} />
          <Field label="First Name" value={employee.firstName} />
          <Field label="Last Name" value={employee.lastName} />
          <Field label="Email" value={employee.email} />
          <Field label="Phone Number" value={employee.phoneNumber} />
          <Field label="Department" value={employee.department} />
          <Field label="Position" value={employee.position} />
          <Field label="Salary" value={formatCurrency(employee.salary)} />
          <Field label="Joining Date" value={formatDate(employee.joiningDate)} />
        </div>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete employee"
          message={`Are you sure you want to delete ${employee.firstName} ${employee.lastName} (${employee.id})? This action cannot be undone.`}
          confirmLabel="Delete"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
    </div>
  )
}

function Field({ label, value, mono }) {
  return (
    <div className="detail-field">
      <label>{label}</label>
      <span className={mono ? 'mono' : ''}>{value ?? '—'}</span>
    </div>
  )
}
