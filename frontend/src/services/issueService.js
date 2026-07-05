import api from "@/services/api"

export const issueService = {
  async listRecent(workspaceId, { limit = 5 } = {}) {
    const { data } = await api.get("/issues/", {
      params: {
        workspace: workspaceId,
        ordering: "-created_at",
      },
    })
    return data.results.slice(0, limit)
  },

  async listAssignedToMe(workspaceId, userId) {
    const { data } = await api.get("/issues/", {
      params: {
        workspace: workspaceId,
        assignee: userId,
      },
    })
    return data.results
  },
}