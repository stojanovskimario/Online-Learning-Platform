import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/store'
import { logout } from '@/store/authSlice'

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth)

    const logoutUser = () => dispatch(logout())

    return { user, token, isAuthenticated, logoutUser }
}