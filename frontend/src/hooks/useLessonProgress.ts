import { useQuery } from '@tanstack/react-query'
import { getLessonProgressApi } from '@/api/progress.api'

export const useLessonProgress = (lessonId?: string) => {
    return useQuery({
        queryKey: ['lesson-progress', lessonId],
        queryFn: () => getLessonProgressApi(Number(lessonId)),
        enabled: !!lessonId,
    })
}
