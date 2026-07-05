import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Building2 } from "lucide-react"
import { useWorkspace } from "@/contexts/WorkspaceContext"

function WorkspaceSelector() {
  const { workspaces, activeWorkspace, selectWorkspace, loading } = useWorkspace()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="h-10 w-48 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
    )
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400">
        No workspaces found
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700
                   text-slate-900 dark:text-white transition-colors min-w-[180px] justify-between"
      >
        <span className="flex items-center gap-2 truncate">
          <Building2 size={16} className="text-slate-400 shrink-0" />
          <span className="truncate font-medium">
            {activeWorkspace?.name ?? "Select workspace"}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full min-w-[220px] rounded-lg border border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-800 shadow-lg z-50 overflow-hidden">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => {
                selectWorkspace(ws.id)
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left
                         hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {ws.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {ws.member_count} member{ws.member_count !== 1 ? "s" : ""}
                </span>
              </div>
              {String(ws.id) === String(activeWorkspace?.id) && (
                <Check size={16} className="text-indigo-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkspaceSelector