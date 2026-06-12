import { useQuery } from '@tanstack/react-query'
import { getRecentQuizAttemptsApi } from '@/api/quizAttempts.api'

export const useRecentQuizAttempts = () => {
  return useQuery({
    queryKey: ['recent-quiz-attempts'],
    queryFn: getRecentQuizAttemptsApi,
  })
}

