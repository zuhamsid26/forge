import { useState } from "react"
import Modal from "@/components/Modal"
import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"
import { workspaceService } from "@/services/workspaceService"

function CreateWorkspaceModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const workspace = await workspaceService.create({ name: name.trim() })
      setName("")
      onCreated(workspace)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create workspace."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
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

export default CreateWorkspaceModal