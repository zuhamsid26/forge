import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext.jsx'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext.jsx'
import { ThemeProvider } from '@/contexts/ThemeContext.jsx'
import ProtectedRoute from '@/components/ProtectedRoute.jsx'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import IssuesPage from './pages/IssuesPage.jsx'
import IssueDetailPage from './pages/IssueDetailPage.jsx'
import ErrorBoundary from '@/components/ErrorBoundary.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <WorkspaceProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                path="/issues"
                element={
                  <ProtectedRoute>
                    <IssuesPage />
                  </ProtectedRoute>
                }
                />
                <Route
                path="/issues/:id"
                element={
                  <ProtectedRoute>
                    <IssueDetailPage />
                  </ProtectedRoute>
                }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </WorkspaceProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
