import { NavLink, useNavigate } from "react-router-dom"
import { LogOut, LayoutDashboard, ListTodo } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
    }`

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-slate-900 dark:text-white">Forge</span>
        <div className="flex items-center gap-1">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to="/issues" className={linkClass}>
            <ListTodo size={16} />
            Issues
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {user.first_name} {user.last_name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar