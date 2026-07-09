import { useState } from "react"
import Modal from "@/components/Modal"
import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"
import { issueService } from "@/services/issueService"

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

function CreateIssueModal({ open, onClose, projects, members, defaultProjectId, onCreated }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState(defaultProjectId ?? "")
  const [priority, setPriority] = useState("MEDIUM")
  const [assigneeId, setAssigneeId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !projectId) return

    setSubmitting(true)
    setError(null)
    try {
      const issue = await issueService.create({
        project: Number(projectId),
        title: title.trim(),
        description: description.trim(),
        priority,
        assignee_id: assigneeId ? Number(assigneeId) : null,
      })
      setTitle("")
      setDescription("")
      setPriority("MEDIUM")
      setAssigneeId("")
      onCreated(issue)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create issue."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Issue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        />

        <textarea
          placeholder="Description (optional, markdown supported)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none"
        />

        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.first_name} {m.user.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !projectId}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-40"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateIssueModal