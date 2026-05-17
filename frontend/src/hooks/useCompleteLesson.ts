import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeLessonApi } from '@/api/progress.api'

export const useCompleteLesson = (lessonId?: string, courseId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => completeLessonApi(Number(lessonId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-progress', lessonId] })
            queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] })
        },
    })
}
