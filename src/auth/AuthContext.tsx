import { createContext, useContext, useMemo, useState } from 'react'
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
  SessionArgs,
  StoredSession,
  UserRole,
} from '../types'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'lauftour_session'

const readStoredSession = (): StoredSession | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredSession()?.user ?? null)
  const [token, setToken] = useState<string | null>(() => readStoredSession()?.token ?? null)
  const [expiresAt, setExpiresAt] = useState<number | null>(
    () => readStoredSession()?.expiresAt ?? null,
  )

  const login = (name: string, role: UserRole) => {
    const nextUser = { name, role }
    setUser(nextUser)
    const session: StoredSession = {
      user: nextUser,
      token: token ?? '',
      expiresAt: expiresAt ?? 0,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }

  const setSession = (args: SessionArgs) => {
    const nextUser = { name: args.name, role: args.role }
    const nextExpiresAt = Date.now() + args.expiresIn * 1000
    setUser(nextUser)
    setToken(args.token)
    setExpiresAt(nextExpiresAt)
    const session: StoredSession = {
      user: nextUser,
      token: args.token,
      expiresAt: nextExpiresAt,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setExpiresAt(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({ user, token, expiresAt, login, setSession, logout }),
    [user, token, expiresAt],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
