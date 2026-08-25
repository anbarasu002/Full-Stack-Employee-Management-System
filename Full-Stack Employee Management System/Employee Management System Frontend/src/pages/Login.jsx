import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import authService from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY = { email: '', password: '' }
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.password) {
    errors.password = 'Password is required.'
  }
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [infoMessage] = useState(location.state?.toast || '')
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
    setTouched({ email: true, password: true })
    setApiError('')

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const res = await authService.login({
        email: values.email.trim(),
        password: values.password,
      })

      const token = res.data?.token
      const user = res.data?.user

      if (!token || !user) {
        throw new Error('Unexpected response shape from server')
      }

      login(user, token)
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message =
        err.friendlyMessage ||
        err.response?.data?.message ||
        'Invalid email or password.'
      setApiError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const err = (field) => touched[field] && errors[field]

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign in to Employee Management System"
      subtitle="Enter your credentials to access the dashboard."
    >
      {infoMessage && <div className="auth-banner auth-banner--success">{infoMessage}</div>}
      {apiError && <div className="auth-banner auth-banner--error">{apiError}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
            disabled={submitting}
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
            autoComplete="current-password"
            className={err('password') ? 'has-error' : ''}
            value={values.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="Your password"
            disabled={submitting}
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

        <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        Don&rsquo;t have an account? <Link to="/register">Create account</Link>
      </p>
    </AuthLayout>
  )
}