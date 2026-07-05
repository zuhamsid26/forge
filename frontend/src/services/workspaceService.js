import api from "@/services/api"

export const workspaceService = {
  async list() {
    const { data } = await api.get("/workspaces/")
    return data.results
  },

  async get(workspaceId) {
    const { data } = await api.get(`/workspaces/${workspaceId}/`)
    return data
  },

  async create({ name }) {
    const { data } = await api.post("/workspaces/", { name })
    return data
  },

  async getDashboard(workspaceId) {
    const { data } = await api.get(`/workspaces/${workspaceId}/dashboard/`)
    return data
  },
}