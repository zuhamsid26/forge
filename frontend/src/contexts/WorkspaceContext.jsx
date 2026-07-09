import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { workspaceService } from "@/services/workspaceService"
import { useAuth } from "@/contexts/AuthContext"

const WorkspaceContext = createContext(null)

const ACTIVE_WORKSPACE_KEY = "forge_active_workspace_id"

export function WorkspaceProvider({ children }) {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    () => localStorage.getItem(ACTIVE_WORKSPACE_KEY)
  )
  const [loading, setLoading] = useState(true)

  const loadWorkspaces = useCallback(async () => {
    setLoading(true)
    try {
      const data = await workspaceService.list()
      setWorkspaces(data)

      const savedId = localStorage.getItem(ACTIVE_WORKSPACE_KEY)
      const savedExists = data.some((ws) => String(ws.id) === savedId)

      if (savedExists) {
        setActiveWorkspaceId(savedId)
      } else if (data.length > 0) {
        setActiveWorkspaceId(String(data[0].id))
        localStorage.setItem(ACTIVE_WORKSPACE_KEY, String(data[0].id))
      } else {
        setActiveWorkspaceId(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setWorkspaces([])
    setActiveWorkspaceId(null)
    if (user) {
      loadWorkspaces()
    } else {
      localStorage.removeItem(ACTIVE_WORKSPACE_KEY)
      setLoading(false)
    }
  }, [user, loadWorkspaces])

  function selectWorkspace(workspaceId) {
    setActiveWorkspaceId(String(workspaceId))
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, String(workspaceId))
  }

  const activeWorkspace = workspaces.find(
    (ws) => String(ws.id) === String(activeWorkspaceId)
  ) || null

  const value = {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    loading,
    selectWorkspace,
    refetchWorkspaces: loadWorkspaces,
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}