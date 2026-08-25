import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import authService from '../services/authService.js'

const EMPTY = { name: '', email: '', password: '', confirmPassword: '' }
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Name is required.'

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  }  else if (values.password.length !== 8) {
  errors.password = 'Password must be exactly 8 characters.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export default function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field) => (e) => {
    const value = e.target.value
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    if (touched[field]) {
      setErrors(validate(nextValues))
    }
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    setApiError('')

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await authService.register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { state: { toast: 'Account created! Please sign in.' } })
      }, 1200)
    } catch (err) {
      const message =
        err.friendlyMessage ||
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      setApiError(message)
      setSubmitting(false)
    }
  }

  const err = (field) => touched[field] && errors[field]

  return (
    <AuthLayout
      eyebrow="Get Started"
      title="Create your account"
      subtitle="Register to access the employee management console."
    >
      {apiError && <div className="auth-banner auth-banner--error">{apiError}</div>}
      {success && (
        <div className="auth-banner auth-banner--success">
          Account created successfully! Redirecting to login…
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={err('name') ? 'has-error' : ''}
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            placeholder="Your Name"
            disabled={submitting || success}
          />
          {err('name') && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={err('email') ? 'has-error' : ''}
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="Your Email"
            disabled={submitting || success}
          />
          {err('email') && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group auth-password-field">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={err('password') ? 'has-error' : ''}
            value={values.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="Password must be exactly 8 characters"
            disabled={submitting || success}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {err('password') && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group auth-password-field">
          <label htmlFor="confirmPassword">
            Confirm Password <span className="required">*</span>
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={err('confirmPassword') ? 'has-error' : ''}
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            placeholder="Re-enter your password"
            disabled={submitting || success}
          />
          {err('confirmPassword') && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary auth-submit" disabled={submitting || success}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  )
}