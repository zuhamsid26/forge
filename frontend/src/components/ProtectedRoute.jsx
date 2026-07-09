import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default ProtectedRoute
