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

  async getMembers(workspaceId) {
    const { data } = await api.get(`/workspaces/${workspaceId}/members/`)
    return data.results
  },

  async addMember(workspaceId, username) {
    const { data } = await api.post(`/workspaces/${workspaceId}/members/`, { username })
    return data
  },
}