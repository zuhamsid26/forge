import { useState, useEffect } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import WorkspaceSelector from "@/components/WorkspaceSelector"
import ProjectCard from "@/components/ProjectCard"
import DashboardCards from "@/components/DashboardCards"
import DashboardCharts from "@/components/DashboardCharts"
import RecentIssues from "@/components/RecentIssues"
import RecentActivity from "@/components/RecentActivity"
import AssignedToMe from "@/components/AssignedToMe"
import { useAuth } from "@/contexts/AuthContext"
import { issueService } from "@/services/issueService"
import { useWorkspace } from "@/contexts/WorkspaceContext"
import { projectService } from "@/services/projectService"
import { dashboardService } from "@/services/dashboardService"

function DashboardPage() {
  const { activeWorkspace } = useWorkspace()
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentIssues, setRecentIssues] = useState([])
  const [recentIssuesLoading, setRecentIssuesLoading] = useState(true)
  const [assignedIssues, setAssignedIssues] = useState([])
  const [assignedLoading, setAssignedLoading] = useState(true)

  useEffect(() => {
    if (!activeWorkspace) return

    setProjectsLoading(true)
    projectService
      .list(activeWorkspace.id)
      .then(setProjects)
      .finally(() => setProjectsLoading(false))

    setStatsLoading(true)
    dashboardService
      .getStats(activeWorkspace.id)
      .then(setStats)
      .finally(() => setStatsLoading(false))

    setRecentIssuesLoading(true)
    issueService
      .listRecent(activeWorkspace.id)
      .then(setRecentIssues)
      .finally(() => setRecentIssuesLoading(false))

    setAssignedLoading(true)
      issueService
        .listAssignedToMe(activeWorkspace.id, user.id)
        .then(setAssignedIssues)
        .finally(() => setAssignedLoading(false))
  }, [activeWorkspace])

  async function handleArchiveToggle(project) {
    const updated = project.archived
      ? await projectService.unarchive(project.id)
      : await projectService.archive(project.id)

    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <WorkspaceSelector />
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-8">
        {statsLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading stats...</p>
        ) : stats ? (
          <>
            <DashboardCards stats={stats} />
            <div className="mt-6">
              <DashboardCharts stats={stats} />
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Projects</h2>

        {projectsLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No projects in this workspace.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onArchiveToggle={handleArchiveToggle}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Issues</h2>
        {recentIssuesLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading issues...</p>
        ) : (
          <RecentIssues issues={recentIssues} />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {statsLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading activity...</p>
        ) : stats ? (
          <RecentActivity activity={stats.recent_activity} />
        ) : null}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Assigned to Me</h2>
        {assignedLoading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading your issues...</p>
        ) : (
          <AssignedToMe issues={assignedIssues} />
        )}
      </div>

    </div>
  )
}

export default DashboardPage