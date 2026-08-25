export default function StatusBadge({ status }) {
  const isActive = status === 'Active'
  return (
    <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
      <span className="badge-dot" />
      {status}
    </span>
  )
}
