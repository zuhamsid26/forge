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
import { StatCardsSkeleton, ChartsSkeleton, ProjectCardsSkeleton, IssueListSkeleton, ActivityListSkeleton } from "@/components/DashboardSkeletons"
import ErrorBanner from "@/components/ErrorBanner"
import { getErrorMessage } from "@/utils/errorMessage"


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
  const [statsError, setStatsError] = useState(null)
  const [projectsError, setProjectsError] = useState(null)
  const [recentIssuesError, setRecentIssuesError] = useState(null)
  const [assignedError, setAssignedError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!activeWorkspace) return

    setProjectsLoading(true)
    setProjectsError(null)
    projectService
      .list(activeWorkspace.id)
      .then(setProjects)
      .catch((err) => setProjectsError(getErrorMessage(err, "Couldn't load projects.")))
      .finally(() => setProjectsLoading(false))

    setStatsLoading(true)
    setStatsError(null)
    dashboardService
      .getStats(activeWorkspace.id)
      .then(setStats)
      .catch((err) => setStatsError(getErrorMessage(err, "Couldn't load dashboard stats.")))
      .finally(() => setStatsLoading(false))

    setRecentIssuesLoading(true)
    setRecentIssuesError(null)
    issueService
      .listRecent(activeWorkspace.id)
      .then(setRecentIssues)
      .catch((err) => setRecentIssuesError(getErrorMessage(err, "Couldn't load recent issues.")))
      .finally(() => setRecentIssuesLoading(false))

    setAssignedLoading(true)
    setAssignedError(null)
    issueService
      .listAssignedToMe(activeWorkspace.id, user.id)
      .then(setAssignedIssues)
      .catch((err) => setAssignedError(getErrorMessage(err, "Couldn't load your assigned issues.")))
      .finally(() => setAssignedLoading(false))
  }, [activeWorkspace, retryKey])

  async function handleArchiveToggle(project) {
    try {
      const updated = project.archived
        ? await projectService.unarchive(project.id)
        : await projectService.archive(project.id)

      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      )
    } catch (err) {
      setProjectsError(getErrorMessage(err, "Couldn't update the project. Please try again."))
    }
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
        {statsError ? (
          <ErrorBanner message={statsError} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : statsLoading ? (
          <>
            <StatCardsSkeleton />
            <div className="mt-6">
              <ChartsSkeleton />
            </div>
          </>
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

        {projectsError ? (
          <ErrorBanner message={projectsError} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : projectsLoading ? (
          <ProjectCardsSkeleton />
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
        {recentIssuesError ? (
          <ErrorBanner message={recentIssuesError} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : recentIssuesLoading ? (
          <IssueListSkeleton rows={5} />
        ) : (
          <RecentIssues issues={recentIssues} />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {statsError ? (
          <ErrorBanner message={statsError} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : statsLoading ? (
          <ActivityListSkeleton rows={5} />
        ) : stats ? (
          <RecentActivity activity={stats.recent_activity} />
        ) : null}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Assigned to Me</h2>
        {assignedError ? (
          <ErrorBanner message={assignedError} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : assignedLoading ? (
          <IssueListSkeleton rows={3} />
        ) : (
          <AssignedToMe issues={assignedIssues} />
        )}
      </div>

    </div>
  )
}

export default DashboardPage