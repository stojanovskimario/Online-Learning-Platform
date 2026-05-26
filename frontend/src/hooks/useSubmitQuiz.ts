import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitQuizAttemptApi } from '@/api/quiz.api'
import type { QuizAttemptResult, QuizAttemptSubmission } from '@/types/quiz.types'

export const useSubmitQuiz = (quizId?: number) => {
    const queryClient = useQueryClient()

    return useMutation<QuizAttemptResult, unknown, QuizAttemptSubmission>({
        mutationFn: (submission) => submitQuizAttemptApi(Number(quizId), submission),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quiz-attempts', quizId] })
        },
    })
}


