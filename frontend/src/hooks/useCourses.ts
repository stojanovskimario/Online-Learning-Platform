import { useQuery } from '@tanstack/react-query'
import { getCoursesApi } from '@/api/courses.api'

export const useCourses = (page = 0, size = 20) => {
    return useQuery({
        queryKey: ['courses', page, size],
        queryFn: () => getCoursesApi(page, size),
    })
}
