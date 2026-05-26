import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resetCourseProgressApi } from '@/api/progress.api'

export const useResetCourseProgress = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (courseId: number) => resetCourseProgressApi(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-progress'] })
            queryClient.invalidateQueries({ queryKey: ['lesson-progress'] })
        },
    })
}


