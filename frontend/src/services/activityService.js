import api from "@/services/api"

export const activityService = {
  async list(issueId) {
    const { data } = await api.get("/issues/activity/", {
      params: { issue: issueId },
    })
    return data.results
  },
}