import { useQuery } from '@tanstack/react-query'
import { getLessonsByCourseApi } from '@/api/lessons.api'

export const useCourseLessons = (courseId?: string) => {
    return useQuery({
        queryKey: ['course-lessons', courseId],
        queryFn: () => getLessonsByCourseApi(Number(courseId)),
        enabled: !!courseId,
    })
}
