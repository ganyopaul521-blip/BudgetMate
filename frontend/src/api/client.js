import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const client = axios.create({ baseURL })

// AuthContext registers a handler here so an expired/invalid token clears
// React's signed-in state instead of forcing a hard page reload. This check
// runs in the background on EVERY page (even public ones, to restore a
// session silently) - a hard `window.location.href` jump on 401 used to fire
// from wherever the user happened to be, including the public landing page,
// whenever a stale leftover token's background validity check failed.
// Clearing state and letting ProtectedRoute (which only wraps the signed-in
// pages) redirect declaratively means a public page is never hijacked.
let onUnauthorized = null
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('budgetedge_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    // Sliding session: the backend reissues a token stamped with the current
    // activity time on every authenticated request - persist it so the 30-minute
    // window keeps sliding forward instead of expiring on a flat timer.
    const refreshed = response.headers['x-refreshed-token']
    if (refreshed) {
      localStorage.setItem('budgetedge_token', refreshed)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('budgetedge_token')
      onUnauthorized?.()
    }
    return Promise.reject(error)
  }
)

export default client
