const ACTION_LABELS = {
  CREATED: "created",
  UPDATED: "updated",
  ASSIGNED: "was assigned to",
  STATUS_CHANGED: "changed status of",
  COMMENTED: "commented on",
}

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function RecentActivity({ activity }) {
  if (activity.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No recent activity in this workspace.
      </p>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
      {activity.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between px-4 py-3">
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
            <span className="font-medium text-slate-900 dark:text-white">
              {entry.user.first_name}
            </span>{" "}
            {ACTION_LABELS[entry.action] ?? entry.action.toLowerCase()}{" "}
            <span className="italic">
              {entry.issue_title ?? "an issue"}
            </span>
          </p>
          <span className="text-xs text-slate-400 shrink-0 ml-3">
            {timeAgo(entry.created_at)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity