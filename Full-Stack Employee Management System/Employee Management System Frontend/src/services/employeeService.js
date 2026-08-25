import api from './api'

const employeeService = {
  getAll: (params = {}) => api.get('/employees', { params }),

  getById: (id) => api.get(`/employees/${id}`),

  create: (employee) => api.post('/employees', employee),

  update: (id, employee) => api.put(`/employees/${id}`, employee),

  remove: (id) => api.delete(`/employees/${id}`),

  getDepartments: () => api.get('/employees/departments'),

  getDashboardStats: () => api.get('/employees/dashboard/stats'),
}

export default employeeService
