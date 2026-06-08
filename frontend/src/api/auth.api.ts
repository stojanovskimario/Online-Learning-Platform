import axiosClient from './axiosClient'
import type { User } from '@/types/user.types'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/user.types'

export const loginApi = (data: LoginRequest) =>
    axiosClient.post<AuthResponse>('/auth/login', data).then((res) => res.data)

export const registerApi = (data: RegisterRequest) =>
    axiosClient.post<AuthResponse>('/auth/register', data).then((res) => res.data)

export const getCurrentUserApi = () =>
    axiosClient.get<User>('/api/users/me').then((res) => res.data)
