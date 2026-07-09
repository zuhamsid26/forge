import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8">
      <div className="text-center max-w-sm">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">404</p>
        <h1 className="text-xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage