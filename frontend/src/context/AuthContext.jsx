import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/endpoints'
import { setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)
const TOKEN_KEY = 'thebudget_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  // A 401 from any request (including the silent "is my saved token still
  // valid?" check above) clears the signed-in user here. Nothing navigates
  // on its own: ProtectedRoute reacts to `user` becoming null and redirects
  // only the signed-in pages it wraps, so a public page is never affected.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const register = useCallback(async (fullName, email, password) => {
    const res = await authApi.register({ fullName, email, password })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const loginWithGoogle = useCallback(async (credential) => {
    const res = await authApi.google(credential)
    localStorage.setItem(TOKEN_KEY, res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
