import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import authService from '../services/authService.js'
import { getStoredToken, setStoredToken } from '../services/api.js'

const USER_KEY = 'orbithr_user'
const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setCheckingSession(false)
      return
    }
    authService
      .me()
      .then((res) => {
        setUser(res.data)
        localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      })
      .catch(() => {
        setStoredToken(null)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setCheckingSession(false))
  }, [])

  const login = useCallback((userData, token) => {
    setStoredToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      
    }
    setStoredToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    checkingSession,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
