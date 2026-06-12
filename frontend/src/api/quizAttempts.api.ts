import axiosClient from './axiosClient'

export const getRecentQuizAttemptsApi = () =>
  axiosClient.get('/api/quiz-attempts/recent').then((res) => res.data)

