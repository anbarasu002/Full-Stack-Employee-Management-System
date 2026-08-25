import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3200)
    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!message) return null

  return (
    <div className={`toast toast--${type}`} role="status">
      {type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5l3 3 7-7" stroke="#0e9f8b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="#e5484d" strokeWidth="1.6" />
          <path d="M8 5v3.5M8 11h.01" stroke="#e5484d" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  )
}
