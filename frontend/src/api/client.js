import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const client = axios.create({ baseURL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('budgetmate_token')
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
      localStorage.setItem('budgetmate_token', refreshed)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('budgetmate_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
