import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import employeeService from '../services/employeeService.js'
import EmployeeForm from '../components/EmployeeForm.jsx'

export default function AddEmployee() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setApiError('')
    try {
      await employeeService.create(values)
      navigate('/employees', { state: { toast: 'Employee added successfully.' } })
    } catch (err) {
      setApiError(err.friendlyMessage)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="eyebrow">New Record</span>
          <h2>Add Employee</h2>
          <p>Fill in the details below to add a new employee to the system.</p>
        </div>
      </div>

      {apiError && (
        <div className="card card-pad" style={{ marginBottom: 16, borderColor: 'var(--coral-600)' }}>
          <p style={{ color: 'var(--coral-600)', fontSize: 13.5, fontWeight: 500 }}>{apiError}</p>
        </div>
      )}

      <EmployeeForm
        initialValues={{}}
        submitting={submitting}
        submitLabel="Add Employee"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/employees')}
      />
    </div>
  )
}
