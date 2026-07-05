import api from "@/services/api"

export const projectService = {
  async list(workspaceId) {
    const { data } = await api.get("/projects/", {
      params: { workspace: workspaceId },
    })
    return data.results
  },

  async get(projectId) {
    const { data } = await api.get(`/projects/${projectId}/`)
    return data
  },

  async create({ workspace, name, description, icon, color }) {
    const { data } = await api.post("/projects/", {
      workspace, name, description, icon, color,
    })
    return data
  },

  async archive(projectId) {
    const { data } = await api.post(`/projects/${projectId}/archive/`)
    return data
  },

  async unarchive(projectId) {
    const { data } = await api.post(`/projects/${projectId}/unarchive/`)
    return data
  },
}