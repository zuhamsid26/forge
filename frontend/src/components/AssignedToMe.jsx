const STATUS_STYLES = {
  TODO: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
}

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

const PRIORITY_STYLES = {
  LOW: "text-slate-400",
  MEDIUM: "text-amber-500",
  HIGH: "text-orange-500",
  CRITICAL: "text-rose-500",
}

function AssignedToMe({ issues }) {
  if (issues.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No issues assigned to you in this workspace.
      </p>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
      {issues.map((issue) => (
        <div key={issue.id} className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {issue.title}
            </span>
            <span className={`text-xs font-medium ${PRIORITY_STYLES[issue.priority]}`}>
              {issue.priority}
            </span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${STATUS_STYLES[issue.status]}`}
          >
            {STATUS_LABELS[issue.status] ?? issue.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default AssignedToMe