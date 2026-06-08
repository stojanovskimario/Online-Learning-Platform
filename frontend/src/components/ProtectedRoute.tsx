import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useAuth } from '@/hooks/useAuth'
import { setCredentials } from '@/store/authSlice'
import type { AppDispatch } from '@/store/store'

interface Props {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
    const { user, isAuthenticated } = useAuth()
    const currentUserQuery = useCurrentUser()

    useEffect(() => {
        if (currentUserQuery.data && isAuthenticated) {
            const token = localStorage.getItem('token') ?? ''
            dispatch(setCredentials({ user: currentUserQuery.data, token }))
        }
    }, [currentUserQuery.data, dispatch, isAuthenticated])

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!user && currentUserQuery.isLoading) {
        return <div className="min-h-screen bg-[#0f1117]" />
    }

    return <>{children}</>
}

export default ProtectedRoute