import { useState, useEffect } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import WorkspaceSelector from "@/components/WorkspaceSelector"
import { useWorkspace } from "@/contexts/WorkspaceContext"
import { issueService } from "@/services/issueService"
import { projectService } from "@/services/projectService"
import { useNavigate } from "react-router-dom"
import { IssueTableSkeleton } from "@/components/DashboardSkeletons"
import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"
import CreateIssueModal from "@/components/CreateIssueModal"
import { workspaceService } from "@/services/workspaceService"

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

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"]
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
  { value: "due_date", label: "Due date (earliest)" },
  { value: "-due_date", label: "Due date (latest)" },
  { value: "priority_rank", label: "Priority (low to high)" },
  { value: "-priority_rank", label: "Priority (high to low)" },
]

function IssuesPage() {
  const { activeWorkspace } = useWorkspace()
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [projects, setProjects] = useState([])
  const [projectFilter, setProjectFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [ordering, setOrdering] = useState("-created_at")

  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  const [members, setMembers] = useState([])
  const [showCreateIssue, setShowCreateIssue] = useState(false)

  useEffect(() => {
    if (!activeWorkspace) return
    projectService.list(activeWorkspace.id).then(setProjects)
  }, [activeWorkspace])

  useEffect(() => {
    if (!activeWorkspace) return
    workspaceService.getMembers(activeWorkspace.id).then(setMembers)
  }, [activeWorkspace])

  useEffect(() => {
    if (!activeWorkspace) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    issueService
      .list({
        workspaceId: activeWorkspace.id,
        project: projectFilter || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search || undefined,
        ordering,
        page,
      })
      .then((data) => {
        setIssues(data.results)
        setCount(data.count)
      })
      .catch((err) => setError(getErrorMessage(err, "Couldn't load issues.")))
      .finally(() => setLoading(false))
  }, [activeWorkspace, projectFilter, statusFilter, priorityFilter, search, ordering, page, retryKey])

  useEffect(() => {
    setPage(1)
  }, [activeWorkspace, projectFilter, statusFilter, priorityFilter, search, ordering])

  function handleSearchSubmit(e) {
    e.preventDefault()
    setSearch(searchInput)
  }

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Issues</h1>
        <div className="flex items-center gap-3">
          <WorkspaceSelector />
          <button
            onClick={() => setShowCreateIssue(true)}
            disabled={projects.length === 0}
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + New Issue
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm w-56"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {error ? (
          <ErrorBanner message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : loading ? (
          <IssueTableSkeleton rows={8} />
        ) : issues.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No issues found.</p>
        ) : (
          <>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-left text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Assignee</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {issues.map((issue) => (
                    <tr
                      key={issue.id}
                      onClick={() => navigate(`/issues/${issue.id}`)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {issue.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {issue.project_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[issue.status]}`}>
                          {STATUS_LABELS[issue.status] ?? issue.status}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium ${PRIORITY_STYLES[issue.priority]}`}>
                        {issue.priority}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {issue.assignee ? issue.assignee.first_name : "Unassigned"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {issue.due_date ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">
                <span>
                  Page {page} of {totalPages} ({count} issues)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateIssueModal
        open={showCreateIssue}
        onClose={() => setShowCreateIssue(false)}
        projects={projects}
        members={members}
        onCreated={() => setRetryKey((k) => k + 1)}
      />

    </div>
  )
}

export default IssuesPage