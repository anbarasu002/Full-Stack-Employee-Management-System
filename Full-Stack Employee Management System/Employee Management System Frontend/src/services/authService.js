import api from './api'

const authService = {
  register: (payload) => api.post('/auth/register', payload),

  login: (payload) => api.post('/auth/login', payload),

  logout: () => api.post('/auth/logout'),

  me: () => api.get('/auth/me'),
}

export default authService
