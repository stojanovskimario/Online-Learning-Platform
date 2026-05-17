import { useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollInCourseApi } from '@/api/enrollments.api'

export const useEnrollInCourse = (courseId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => enrollInCourseApi(Number(courseId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            queryClient.invalidateQueries({ queryKey: ['enrollment-status', courseId] })
            queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
        },
    })
}
