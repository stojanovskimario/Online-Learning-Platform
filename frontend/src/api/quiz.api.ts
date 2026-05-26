import axiosClient from './axiosClient'
import type { Quiz, QuizAttemptResult, QuizAttemptSubmission } from '@/types/quiz.types'

export const getQuizByLessonApi = (lessonId: number) =>
    axiosClient
        .get<Quiz>(`/api/lessons/${lessonId}/quiz`)
        .then((res) => res.data)

export const submitQuizAttemptApi = (quizId: number, submission: QuizAttemptSubmission) =>
    axiosClient
        .post<QuizAttemptResult>(`/api/quizzes/${quizId}/attempt`, submission)
        .then((res) => res.data)

