export function StatusBadge({ status }) {
  const normalized = (status || "Pending").toLowerCase();

  let badgeClass = "badge-pending";
  let label = status || "Pending";
  let icon = "⏳";

  if (normalized.includes("confirm")) {
    badgeClass = "badge-confirmed";
    icon = "✓";
  } else if (normalized.includes("prep")) {
    badgeClass = "badge-preparing";
    icon = "🍳";
  } else if (normalized.includes("ready")) {
    badgeClass = "badge-ready";
    icon = "🔔";
  } else if (normalized.includes("complete")) {
    badgeClass = "badge-completed";
    icon = "🎉";
  } else if (normalized.includes("cancel")) {
    badgeClass = "badge-cancelled";
    icon = "✕";
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className="badge-icon">{icon}</span>
      <span className="badge-text">{label}</span>
    </span>
  );
}

export default StatusBadge;
