import ThemeToggle from "@/components/ThemeToggle"

function DashboardPage() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ThemeToggle />
      </div>
      <p className="mt-4">Dashboard Page (placeholder — protected route)</p>
    </div>
  )
}

export default DashboardPage
