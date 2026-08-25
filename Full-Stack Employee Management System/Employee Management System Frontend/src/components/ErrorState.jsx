export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-block">
      <span className="state-icon state-icon--error" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3l9 16H2l9-16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M11 9v4M11 15.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <h3>Unable to load data</h3>
      <p>{message || 'Unable to connect to the server. Please make sure the Spring Boot backend is running.'}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
