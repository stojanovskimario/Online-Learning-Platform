export type ChatMessageRole = 'SYSTEM' | 'USER' | 'ASSISTANT'

export interface ChatMessage {
    id: number
    role: ChatMessageRole
    content: string
    createdAt: string
}

export interface ChatRequest {
    lessonId: number
    message: string
}

export interface ChatResponse {
    answer: string
}
