import { useState, useEffect } from "react"
import { activityService } from "@/services/activityService"

const ACTION_LABELS = {
  CREATED: "created this issue",
  UPDATED: "updated this issue",
  ASSIGNED: "was assigned",
  STATUS_CHANGED: "changed the status",
  COMMENTED: "commented",
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

function ActivityTimeline({ issueId, refreshKey }) {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    activityService
      .list(issueId)
      .then(setActivity)
      .finally(() => setLoading(false))
  }, [issueId, refreshKey])

  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading activity...</p>
  }

  if (activity.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
  }

  return (
    <div className="space-y-3">
      {activity.map((entry) => (
        <div key={entry.id} className="flex justify-between items-start gap-2">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium text-slate-900 dark:text-white">
              {entry.user.first_name}
            </span>{" "}
            {ACTION_LABELS[entry.action] ?? entry.action.toLowerCase()}
          </p>
          <span className="text-xs text-slate-400 shrink-0">{timeAgo(entry.created_at)}</span>
        </div>
      ))}
    </div>
  )
}

export default ActivityTimeline