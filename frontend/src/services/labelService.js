import api from "@/services/api"

export const labelService = {
  async list(workspaceId) {
    const { data } = await api.get("/issues/labels/", {
      params: { workspace: workspaceId },
    })
    return data.results
  },
}