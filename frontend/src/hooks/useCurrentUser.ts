import { useQuery } from '@tanstack/react-query'
import { getCurrentUserApi } from '@/api/auth.api'

export const useCurrentUser = () =>
    useQuery({
        queryKey: ['current-user', localStorage.getItem('token')],
        queryFn: getCurrentUserApi,
        retry: false,
        enabled: !!localStorage.getItem('token'),
    })




