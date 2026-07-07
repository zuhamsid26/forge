import api from "@/services/api"

export const commentService = {
  async list(issueId) {
    const { data } = await api.get("/issues/comments/", {
      params: { issue: issueId },
    })
    return data.results
  },

  async create(issueId, body) {
    const { data } = await api.post("/issues/comments/", {
      issue: issueId,
      body,
    })
    return data
  },
}