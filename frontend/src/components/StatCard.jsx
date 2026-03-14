export default function StatCard({ label, value, hint }) {
  return (
    <article className="metric">
      <div className="muted">{label}</div>
      <div className="value mono">{value}</div>
      {hint ? <div className="muted">{hint}</div> : null}
    </article>
  );
}