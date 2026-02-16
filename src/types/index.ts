import type {ReactNode} from 'react'

export type UserRole = 'runner' | 'admin'

export type AuthUser = {
    name: string
    role: UserRole
}

export type SessionArgs = {
    name: string
    role: UserRole
    token: string
    expiresIn: number
}

export type AuthContextValue = {
    user: AuthUser | null
    token: string | null
    expiresAt: number | null
    login: (name: string, role: UserRole) => void
    setSession: (args: SessionArgs) => void
    logout: () => void
}

export type StoredSession = {
    user: AuthUser
    token: string
    expiresAt: number
}

export type AuthProviderProps = {
    children: ReactNode
}

export type LoginForm = {
    email: string
    password: string
}

export type RegisterForm = {
    email: string
    password: string
    firstName: string
    lastName: string
    birthDate: string
}

export type UserResponse = {
    id: string
    email: string
    firstName: string
    lastName: string
    birthDate: string
}

export type QualifiedUserResponse = {
    id: string
    firstName: string
    lastName: string
    email: string
    birthDate: string
    races: number
}

export type ImportBatchResponse = {
    source: string
    fileName: string
    status: string
    createdResults: number
}
