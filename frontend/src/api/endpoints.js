import client from './client'

export const authApi = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  me: () => client.get('/auth/me'),
  updateProfile: (data) => client.patch('/auth/me', data),
}

export const categoriesApi = {
  list: (type) => client.get('/categories', { params: type ? { type } : {} }),
  create: (data) => client.post('/categories', data),
  remove: (id) => client.delete(`/categories/${id}`),
}

export const transactionsApi = {
  list: (params) => client.get('/transactions', { params }),
  create: (data) => client.post('/transactions', data),
  update: (id, data) => client.put(`/transactions/${id}`, data),
  remove: (id) => client.delete(`/transactions/${id}`),
}

export const budgetsApi = {
  list: (params) => client.get('/budgets', { params }),
  upsert: (data) => client.post('/budgets', data),
  remove: (id) => client.delete(`/budgets/${id}`),
}

export const reportsApi = {
  dashboard: () => client.get('/reports/dashboard'),
  expenseDistribution: (params) => client.get('/reports/expense-distribution', { params }),
  monthlyComparison: () => client.get('/reports/monthly-comparison'),
  categoryTrend: (categoryId) => client.get('/reports/category-trend', { params: { categoryId } }),
  summary: (params) => client.get('/reports/summary', { params }),
}

export const alertsApi = {
  list: () => client.get('/alerts'),
  markRead: (id) => client.patch(`/alerts/${id}/read`),
  markAllRead: () => client.patch('/alerts/read-all'),
}
