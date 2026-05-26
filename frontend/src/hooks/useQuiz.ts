import { useQuery } from '@tanstack/react-query'
import { getQuizByLessonApi } from '@/api/quiz.api'

export const useQuiz = (lessonId?: string) => {
    return useQuery({
        queryKey: ['quiz', lessonId],
        queryFn: () => getQuizByLessonApi(Number(lessonId)),
        enabled: !!lessonId,
        retry: false,
    })
}

