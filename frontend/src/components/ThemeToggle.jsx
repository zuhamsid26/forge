import { Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/ThemeContext"

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      <Moon className="h-4 w-4 text-blue-400" />
    </div>
  )
}

export default ThemeToggle
