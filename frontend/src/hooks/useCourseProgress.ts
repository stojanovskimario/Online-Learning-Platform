import { useQuery } from '@tanstack/react-query'
import { getCourseProgressApi } from '@/api/progress.api'

export const useCourseProgress = (courseId?: string, enabled = true) => {
    return useQuery({
        queryKey: ['course-progress', courseId],
        queryFn: () => getCourseProgressApi(Number(courseId)),
        enabled: !!courseId && enabled,
    })
}
