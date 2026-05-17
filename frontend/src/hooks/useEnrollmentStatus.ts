import { useQuery } from '@tanstack/react-query'
import { getEnrollmentStatusApi } from '@/api/enrollments.api'

export const useEnrollmentStatus = (courseId?: string) => {
    return useQuery({
        queryKey: ['enrollment-status', courseId],
        queryFn: () => getEnrollmentStatusApi(Number(courseId)),
        enabled: !!courseId,
    })
}
