import { useQuery } from '@tanstack/react-query'
import { getCourseByIdApi } from '@/api/courses.api'

export const useCourse = (id?: string) => {
    return useQuery({
        queryKey: ['course', id],
        queryFn: () => getCourseByIdApi(Number(id)),
        enabled: !!id,
    })
}
