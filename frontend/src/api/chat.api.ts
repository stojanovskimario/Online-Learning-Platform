import axiosClient from './axiosClient'
import type { ChatMessage, ChatRequest, ChatResponse } from '@/types/chat.types'

export const getChatHistoryApi = (lessonId: number) =>
    axiosClient
        .get<ChatMessage[]>(`/api/chat/lessons/${lessonId}/messages`)
        .then((response) => response.data)

export const sendChatMessageApi = (request: ChatRequest) =>
    axiosClient
        .post<ChatResponse>('/api/chat', request)
        .then((response) => response.data)

export const clearChatHistoryApi = (lessonId: number) =>
    axiosClient.delete(`/api/chat/lessons/${lessonId}/messages`)
