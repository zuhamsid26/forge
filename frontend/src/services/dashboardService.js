import api from "@/services/api"

export const dashboardService = {
  async getStats(workspaceId) {
    const { data } = await api.get(`/workspaces/${workspaceId}/dashboard/`)
    return data
  },
}