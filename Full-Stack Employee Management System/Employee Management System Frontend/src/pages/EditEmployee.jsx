import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import employeeService from '../services/employeeService.js'
import EmployeeForm from '../components/EmployeeForm.jsx'
import Loader from '../components/Loader.jsx'
import ErrorState from '../components/ErrorState.jsx'

export default function EditEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

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

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setApiError('')
    try {
      await employeeService.update(id, values)
      navigate(`/employees/${id}`, { state: { toast: 'Employee updated successfully.' } })
    } catch (err) {
      setApiError(err.friendlyMessage)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Link to={`/employees/${id}`} className="back-link">
        ← Back to profile
      </Link>

      <div className="page-header">
        <div>
          <span className="eyebrow">Edit Record</span>
          <h2>Edit Employee</h2>
          <p>Update the details for this employee.</p>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading employee…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          {apiError && (
            <div className="card card-pad" style={{ marginBottom: 16, borderColor: 'var(--coral-600)' }}>
              <p style={{ color: 'var(--coral-600)', fontSize: 13.5, fontWeight: 500 }}>{apiError}</p>
            </div>
          )}
          <EmployeeForm
            initialValues={{
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              phoneNumber: employee.phoneNumber,
              department: employee.department,
              position: employee.position,
              salary: employee.salary,
              joiningDate: employee.joiningDate,
              status: employee.status,
            }}
            submitting={submitting}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/employees/${id}`)}
          />
        </>
      )}
    </div>
  )
}
