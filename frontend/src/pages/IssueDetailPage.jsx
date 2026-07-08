import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import { issueService } from "@/services/issueService"
import ReactMarkdown from "react-markdown"
import CommentsSection from "@/components/CommentsSection"
import { labelService } from "@/services/labelService"
import { useWorkspace } from "@/contexts/WorkspaceContext"
import { workspaceService } from "@/services/workspaceService"
import ActivityTimeline from "@/components/ActivityTimeline"
import { Skeleton } from "@/components/ui/skeleton"
import { IssueDetailSkeleton } from "@/components/DashboardSkeletons"

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

function IssueDetailPage() {
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const { activeWorkspace } = useWorkspace()
  const [allLabels, setAllLabels] = useState([])
  const [members, setMembers] = useState([])
  const [activityRefreshKey, setActivityRefreshKey] = useState(0)

  useEffect(() => {
    if (!activeWorkspace) return
    labelService.list(activeWorkspace.id).then(setAllLabels)
  }, [activeWorkspace])

  useEffect(() => {
    if (!activeWorkspace) return
    workspaceService.getMembers(activeWorkspace.id).then(setMembers)
  }, [activeWorkspace])

  async function toggleLabel(labelId) {
    const currentIds = issue.labels.map((l) => l.id)
    const newIds = currentIds.includes(labelId)
      ? currentIds.filter((id) => id !== labelId)
      : [...currentIds, labelId]

    const updated = await issueService.update(issue.id, { label_ids: newIds })
    setIssue(updated)
    setActivityRefreshKey((k) => k + 1)
  }

  async function handleAssigneeChange(e) {
    const value = e.target.value
    const assigneeId = value === "" ? null : Number(value)
    const updated = await issueService.update(issue.id, { assignee_id: assigneeId })
    setIssue(updated)
    setActivityRefreshKey((k) => k + 1)
  }

  async function handleStatusChange(e) {
    const updated = await issueService.update(issue.id, { status: e.target.value })
    setIssue(updated)
    setActivityRefreshKey((k) => k + 1)
  }

  async function handlePriorityChange(e) {
    const updated = await issueService.update(issue.id, { priority: e.target.value })
    setIssue(updated)
    setActivityRefreshKey((k) => k + 1)
  }

  async function handleDueDateChange(e) {
    const value = e.target.value || null
    const updated = await issueService.update(issue.id, { due_date: value })
    setIssue(updated)
    setActivityRefreshKey((k) => k + 1)
  }
  useEffect(() => {
    setLoading(true)
    issueService
      .get(id)
      .then(setIssue)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <IssueDetailSkeleton />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <p className="text-slate-500 dark:text-slate-400">Issue not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center">
        <Link
          to="/issues"
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} />
          Back to Issues
        </Link>
        <ThemeToggle />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {issue.project_name}
            </p>
            <h1 className="text-2xl font-bold">{issue.title}</h1>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Description
            </h2>
            {issue.description ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{issue.description}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No description provided.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Comments
            </h2>
            <CommentsSection
              issueId={issue.id}
              onCommentPosted={() => setActivityRefreshKey((k) => k + 1)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</p>
              <select
                value={issue.status}
                onChange={handleStatusChange}
                className="w-full text-sm px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Priority</p>
              <select
                value={issue.priority}
                onChange={handlePriorityChange}
                className={`w-full text-sm px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium ${PRIORITY_STYLES[issue.priority]}`}
              >
                <option value="LOW" className="text-slate-400">Low</option>
                <option value="MEDIUM" className="text-amber-500">Medium</option>
                <option value="HIGH" className="text-orange-500">High</option>
                <option value="CRITICAL" className="text-rose-500">Critical</option>
              </select>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Assignee</p>
              <select
                value={issue.assignee?.id ?? ""}
                onChange={handleAssigneeChange}
                className="w-full text-sm px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.first_name} {member.user.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Reporter</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {issue.reporter.first_name} {issue.reporter.last_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Due Date</p>
              <input
                type="date"
                value={issue.due_date ?? ""}
                onChange={handleDueDateChange}
                className="w-full text-sm px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Labels</p>
              <div className="flex flex-wrap gap-1.5">
                {allLabels.map((label) => {
                  const isActive = issue.labels.some((l) => l.id === label.id)
                  return (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(label.id)}
                      className="text-xs font-medium px-2 py-1 rounded-full border transition-opacity"
                      style={{
                        backgroundColor: isActive ? `${label.color}20` : "transparent",
                        color: label.color,
                        borderColor: label.color,
                        opacity: isActive ? 1 : 0.4,
                      }}
                    >
                      {label.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Activity Timeline
            </h2>
            <ActivityTimeline
              issueId={issue.id}
              refreshKey={activityRefreshKey}
              members={members}
              allLabels={allLabels}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetailPage