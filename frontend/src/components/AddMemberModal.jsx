import { useState } from "react"
import Modal from "@/components/Modal"
import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"
import { workspaceService } from "@/services/workspaceService"

function AddMemberModal({ open, onClose, workspaceId, onAdded }) {
  const [username, setUsername] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const member = await workspaceService.addMember(workspaceId, username.trim())
      setUsername("")
      onAdded(member)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't add member."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            disabled={submitting || !username.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-40"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddMemberModal