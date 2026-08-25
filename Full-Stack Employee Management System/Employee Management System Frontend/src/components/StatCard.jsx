export default function StatCard({ label, value, icon, accent, accentBg }) {
  return (
    <div className="stat-card" style={{ '--accent': accent, '--accent-bg': accentBg }}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon">{icon}</span>
      </div>
      <p className="stat-card__value">{value}</p>
    </div>
  )
}
