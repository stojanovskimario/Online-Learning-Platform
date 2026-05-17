import { useQuery } from '@tanstack/react-query'
import { getMyEnrollmentsApi } from '@/api/enrollments.api'

export const useMyEnrollments = () => {
    return useQuery({
        queryKey: ['my-enrollments'],
        queryFn: getMyEnrollmentsApi,
    })
}
