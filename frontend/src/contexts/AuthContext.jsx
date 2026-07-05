import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "@/services/authService"
import { tokenStorage } from "@/utils/tokenStorage"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      setLoading(false)
      return
    }

    authService
      .fetchCurrentUser()
      .then((data) => setUser(data))
      .catch(() => tokenStorage.clearTokens())
      .finally(() => setLoading(false))
  }, [])

  async function login({ email, password }) {
    await authService.login({ email, password })
    const currentUser = await authService.fetchCurrentUser()
    setUser(currentUser)
    return currentUser
  }

  async function signup(formData) {
    await authService.register(formData)
    return login({ email: formData.email, password: formData.password })
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  const value = { user, loading, login, signup, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
