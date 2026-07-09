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

  async list({ workspaceId, project, status, priority, assignee, search, ordering, page } = {}) {
    const { data } = await api.get("/issues/", {
      params: {
        workspace: workspaceId,
        project,
        status,
        priority,
        assignee,
        search,
        ordering,
        page,
      },
    })
    return data
  },

  async get(issueId) {
    const { data } = await api.get(`/issues/${issueId}/`)
    return data
  },

  async update(issueId, payload) {
    const { data } = await api.patch(`/issues/${issueId}/`, payload)
    return data
  },

  async create(payload) {
    const { data } = await api.post("/issues/", payload)
    return data
  },
}