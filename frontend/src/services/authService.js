import api from "@/services/api"
import { tokenStorage } from "@/utils/tokenStorage"

export const authService = {
  async register({ email, username, first_name, last_name, password }) {
    const { data } = await api.post("/auth/register/", {
      email, username, first_name, last_name, password,
    })
    return data
  },

  async login({ email, password }) {
    const { data } = await api.post("/auth/login/", { email, password })
    tokenStorage.setTokens(data.access, data.refresh)
    return data
  },

  async fetchCurrentUser() {
    const { data } = await api.get("/auth/me/")
    return data
  },

  logout() {
    tokenStorage.clearTokens()
  },
}
