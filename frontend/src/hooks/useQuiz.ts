import { useQuery } from '@tanstack/react-query'
import { getQuizByLessonApi } from '@/api/quiz.api'

export const useQuiz = (lessonId?: string, enabled = true) => {
    return useQuery({
        queryKey: ['quiz', lessonId],
        queryFn: () => getQuizByLessonApi(Number(lessonId)),
        enabled: !!lessonId && enabled,
        retry: false,
    })
}

