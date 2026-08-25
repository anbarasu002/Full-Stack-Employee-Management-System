export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  )
}
