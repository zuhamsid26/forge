import { AlertTriangle } from "lucide-react"

function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-sm px-4 py-3">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-medium underline shrink-0">
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorBanner