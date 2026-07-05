import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

const STATUS_COLORS = {
  TODO: "#94A3B8",
  IN_PROGRESS: "#6366F1",
  DONE: "#10B981",
}

const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
}

const PRIORITY_COLORS = {
  LOW: "#94A3B8",
  MEDIUM: "#F59E0B",
  HIGH: "#F97316",
  CRITICAL: "#EF4444",
}

function DashboardCharts({ stats }) {
  const statusData = Object.entries(stats.issues_by_status).map(([key, value]) => ({
    name: STATUS_LABELS[key] ?? key,
    value,
    color: STATUS_COLORS[key] ?? "#94A3B8",
  }))

  const priorityData = Object.entries(stats.issues_by_priority).map(([key, value]) => ({
    name: PRIORITY_LABELS[key] ?? key,
    value,
    color: PRIORITY_COLORS[key] ?? "#94A3B8",
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Issues by Status
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Issues by Priority
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
            <YAxis stroke="currentColor" fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {priorityData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DashboardCharts