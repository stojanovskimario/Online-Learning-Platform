import axiosClient from './axiosClient'
import type { QuizAttemptSummary } from '@/types/quiz.types'

export const getRecentQuizAttemptsApi = () =>
  axiosClient
    .get<QuizAttemptSummary[]>('/api/quiz-attempts/recent')
    .then((res) => res.data)

