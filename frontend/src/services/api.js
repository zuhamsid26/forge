import axios from "axios"
import { tokenStorage } from "@/utils/tokenStorage"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor: attach access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: on 401, try refreshing the token once, then retry
let isRefreshing = false
let refreshQueue = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until the in-flight refresh finishes
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, originalRequest })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = tokenStorage.getRefreshToken()
        if (!refreshToken) throw new Error("No refresh token available")

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh/`,
          { refresh: refreshToken }
        )
        tokenStorage.setTokens(data.access, data.refresh ?? refreshToken)

        refreshQueue.forEach(({ resolve, originalRequest: queuedRequest }) => {
          queuedRequest.headers.Authorization = `Bearer ${data.access}`
          resolve(api(queuedRequest))
        })
        refreshQueue = []

        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        refreshQueue.forEach(({ reject }) => reject(refreshError))
        refreshQueue = []
        tokenStorage.clearTokens()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
