export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
export type SubscriptionTier = 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL'

export interface User {
    id: number
    username?: string
    email: string
    firstName?: string
    lastName?: string
    role: UserRole
    subscriptionTier: SubscriptionTier
}

export interface AuthResponse {
    accessToken: string
    user: User
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
    role: 'STUDENT' | 'INSTRUCTOR'
}
