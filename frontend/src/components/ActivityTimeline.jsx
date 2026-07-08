import { useState, useEffect, useMemo } from "react"
import { activityService } from "@/services/activityService"

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
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

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function describeEntry(entry, memberMap, labelMap) {
  const meta = entry.metadata || {}

  switch (entry.action) {
    case "CREATED":
      return "created this issue"

    case "COMMENTED":
      return "commented"

    case "STATUS_CHANGED": {
      const from = STATUS_LABELS[meta.from] ?? meta.from
      const to = STATUS_LABELS[meta.to] ?? meta.to
      return `changed the status from ${from} to ${to}`
    }

    case "ASSIGNED": {
      const fromName = meta.from_id ? memberMap[meta.from_id] : null
      const toName = meta.to_id ? memberMap[meta.to_id] : null
      if (!fromName && toName) return `assigned this issue to ${toName}`
      if (fromName && !toName) return `unassigned this issue (was ${fromName})`
      if (fromName && toName) return `reassigned this issue from ${fromName} to ${toName}`
      return "was assigned"
    }

    case "UPDATED": {
      if (meta.field === "priority") {
        const from = PRIORITY_LABELS[meta.from] ?? meta.from
        const to = PRIORITY_LABELS[meta.to] ?? meta.to
        return `changed priority from ${from} to ${to}`
      }
      if (meta.field === "due_date") {
        const from = formatDate(meta.from)
        const to = formatDate(meta.to)
        if (!from && to) return `set due date to ${to}`
        if (from && !to) return `removed the due date (was ${from})`
        return `changed due date from ${from} to ${to}`
      }
      if (meta.field === "labels") {
        const added = (meta.added || []).map((id) => labelMap[id] ?? "a label")
        const removed = (meta.removed || []).map((id) => labelMap[id] ?? "a label")
        const parts = []
        if (added.length) parts.push(`added ${added.join(", ")}`)
        if (removed.length) parts.push(`removed ${removed.join(", ")}`)
        return parts.length ? parts.join("; ") : "updated labels"
      }
      return "updated this issue"
    }

    default:
      return entry.action.toLowerCase()
  }
}

function ActivityTimeline({ issueId, refreshKey, members = [], allLabels = [] }) {
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const memberMap = useMemo(() => {
    const map = {}
    members.forEach((m) => {
      map[m.user.id] = `${m.user.first_name} ${m.user.last_name}`.trim()
    })
    return map
  }, [members])

  const labelMap = useMemo(() => {
    const map = {}
    allLabels.forEach((l) => {
      map[l.id] = l.name
    })
    return map
  }, [allLabels])

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
            {describeEntry(entry, memberMap, labelMap)}
          </p>
          <span className="text-xs text-slate-400 shrink-0">{timeAgo(entry.created_at)}</span>
        </div>
      ))}
    </div>
  )
}

export default ActivityTimeline