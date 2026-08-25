import { useState } from 'react'

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'IT',
  'Customer Support',
  'Legal',
]

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  department: '',
  position: '',
  salary: '',
  joiningDate: '',
  status: 'Active',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+]?[0-9\s-]{7,15}$/

export function validateEmployee(values) {
  const errors = {}

  if (!values.firstName.trim()) errors.firstName = 'First name is required.'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required.'

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required.'
  } else if (!PHONE_REGEX.test(values.phoneNumber.trim())) {
    errors.phoneNumber = 'Enter a valid phone number (7-15 digits).'
  }

  if (!values.department) errors.department = 'Select a department.'
  if (!values.position.trim()) errors.position = 'Position is required.'

  if (values.salary === '' || values.salary === null) {
    errors.salary = 'Salary is required.'
  } else if (Number.isNaN(Number(values.salary)) || Number(values.salary) <= 0) {
    errors.salary = 'Salary must be a valid positive number.'
  }

  if (!values.joiningDate) errors.joiningDate = 'Joining date is required.'
  if (!values.status) errors.status = 'Select a status.'

  return errors
}

export default function EmployeeForm({ initialValues, onSubmit, submitting, submitLabel, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, ...validateEmployee({ ...values, [field]: value }) }))
    }
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateEmployee(values))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateEmployee(values)
    setErrors(validationErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      department: true,
      position: true,
      salary: true,
      joiningDate: true,
      status: true,
    })
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({ ...values, salary: Number(values.salary) })
    }
  }

  const err = (field) => touched[field] && errors[field]

  return (
    <form className="card card-pad form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">
            First Name <span className="required">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            className={err('firstName') ? 'has-error' : ''}
            value={values.firstName}
            onChange={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            placeholder=""
          />
          {err('firstName') && <span className="field-error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name <span className="required">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            className={err('lastName') ? 'has-error' : ''}
            value={values.lastName}
            onChange={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            placeholder=""
          />
          {err('lastName') && <span className="field-error">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={err('email') ? 'has-error' : ''}
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder=""
          />
          {err('email') && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">
            Phone Number <span className="required">*</span>
          </label>
          <input
            id="phoneNumber"
            type="text"
            className={err('phoneNumber') ? 'has-error' : ''}
            value={values.phoneNumber}
            onChange={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            placeholder=""
          />
          {err('phoneNumber') && <span className="field-error">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="department">
            Department <span className="required">*</span>
          </label>
          <select
            id="department"
            className={err('department') ? 'has-error' : ''}
            value={values.department}
            onChange={handleChange('department')}
            onBlur={handleBlur('department')}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {err('department') && <span className="field-error">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="position">
            Position <span className="required">*</span>
          </label>
          <input
            id="position"
            type="text"
            className={err('position') ? 'has-error' : ''}
            value={values.position}
            onChange={handleChange('position')}
            onBlur={handleBlur('position')}
            placeholder=""
          />
          {err('position') && <span className="field-error">{errors.position}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="salary">
            Salary (Annual) <span className="required">*</span>
          </label>
          <input
            id="salary"
            type="number"
            min="0"
            step="0.01"
            className={err('salary') ? 'has-error' : ''}
            value={values.salary}
            onChange={handleChange('salary')}
            onBlur={handleBlur('salary')}
            placeholder=""
          />
          {err('salary') && <span className="field-error">{errors.salary}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="joiningDate">
            Joining Date <span className="required">*</span>
          </label>
          <input
            id="joiningDate"
            type="date"
            className={err('joiningDate') ? 'has-error' : ''}
            value={values.joiningDate}
            onChange={handleChange('joiningDate')}
            onBlur={handleBlur('joiningDate')}
          />
          {err('joiningDate') && <span className="field-error">{errors.joiningDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">
            Status <span className="required">*</span>
          </label>
          <select
            id="status"
            className={err('status') ? 'has-error' : ''}
            value={values.status}
            onChange={handleChange('status')}
            onBlur={handleBlur('status')}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {err('status') && <span className="field-error">{errors.status}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  )
}
