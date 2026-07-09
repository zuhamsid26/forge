import { useState, useEffect } from "react"
import { commentService } from "@/services/commentService"

import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"

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

function CommentsSection({ issueId, onCommentPosted }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [postError, setPostError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setLoadError(null)
    commentService
      .list(issueId)
      .then(setComments)
      .catch((err) => setLoadError(getErrorMessage(err, "Couldn't load comments.")))
      .finally(() => setLoading(false))
  }, [issueId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    setPostError(null)
    try {
      const created = await commentService.create(issueId, newComment.trim())
      setComments((prev) => [...prev, created])
      setNewComment("")
      onCommentPosted?.()
    } catch (err) {
      setPostError(getErrorMessage(err, "Couldn't post your comment. Please try again."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {loadError ? (
        <div className="mb-4">
          <ErrorBanner message={loadError} />
        </div>
      ) : loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No comments yet.</p>
      ) : (
        <div className="space-y-4 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
                {comment.author.first_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {comment.author.first_name} {comment.author.last_name}
                  </span>
                  <span className="text-xs text-slate-400">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {postError && (
        <div className="mb-3">
          <ErrorBanner message={postError} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default CommentsSection