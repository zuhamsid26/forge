import { FolderKanban, ListTodo, AlertTriangle, CheckCircle2 } from "lucide-react"

function StatCard({ icon: Icon, label, value, tone }) {
  const toneStyles = {
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${toneStyles[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}

function DashboardCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={FolderKanban} label="Active Projects" value={stats.active_projects} tone="indigo" />
      <StatCard icon={ListTodo} label="Total Issues" value={stats.total_issues} tone="emerald" />
      <StatCard icon={AlertTriangle} label="Overdue Issues" value={stats.overdue_issues} tone="rose" />
      <StatCard icon={CheckCircle2} label="Total Projects" value={stats.total_projects} tone="amber" />
    </div>
  )
}

export default DashboardCards