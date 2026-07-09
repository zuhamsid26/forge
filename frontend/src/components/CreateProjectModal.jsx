import { useState } from "react"
import Modal from "@/components/Modal"
import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"
import { projectService } from "@/services/projectService"

const DEFAULT_COLOR = "#6366F1"

function CreateProjectModal({ open, onClose, workspaceId, onCreated }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const project = await projectService.create({
        workspace: workspaceId,
        name: name.trim(),
        description: description.trim(),
        icon: "",
        color: DEFAULT_COLOR,
      })
      setName("")
      setDescription("")
      onCreated(project)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create project."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-none"
        />
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
            disabled={submitting || !name.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-40"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateProjectModal