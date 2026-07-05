import { Archive, ArchiveRestore } from "lucide-react"

function ProjectCard({ project, onArchiveToggle }) {
  return (
    <div
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
                 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold shrink-0"
            style={{ backgroundColor: project.color }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">
              {project.name}
            </h3>
            {project.archived && (
              <span className="text-xs text-slate-400">Archived</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onArchiveToggle(project)}
          title={project.archived ? "Unarchive" : "Archive"}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {project.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
        </button>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
        {project.description || "No description provided."}
      </p>
    </div>
  )
}

export default ProjectCard