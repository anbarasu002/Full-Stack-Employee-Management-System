import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8080/api'

const TOKEN_KEY = 'orbithr_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage =
        'Unable to connect to the server. Please make sure the Spring Boot backend is running.'
    } else {
      error.friendlyMessage =
        error.response.data?.message ||
        'Something went wrong. Please try again.'

      error.fieldErrors = error.response.data?.fieldErrors || null

      if (
        error.response.status === 401 &&
        !error.config?.url?.includes('/auth/login')
      ) {
        setStoredToken(null)
        localStorage.removeItem('orbithr_user')

        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api