import { Skeleton } from "@/components/ui/skeleton"

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex items-center gap-4">
      <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ChartCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-[220px] w-full rounded-lg" />
    </div>
  )
}

export function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCardSkeleton />
      <ChartCardSkeleton />
    </div>
  )
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function ProjectCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}

function IssueRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full shrink-0" />
    </div>
  )
}

export function IssueListSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
      {Array.from({ length: rows }).map((_, i) => (
        <IssueRowSkeleton key={i} />
      ))}
    </div>
  )
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-3 w-12 shrink-0 ml-3" />
    </div>
  )
}

export function ActivityListSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
      {Array.from({ length: rows }).map((_, i) => (
        <ActivityRowSkeleton key={i} />
      ))}
    </div>
  )
}


export function IssueTableSkeleton({ rows = 8 }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-700/50 text-left text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Assignee</th>
            <th className="px-4 py-3 font-medium">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}