import { useQuery } from '@tanstack/react-query'
import { getChatHistoryApi } from '@/api/chat.api'

export const useChatHistory = (lessonId?: number) =>
    useQuery({
        queryKey: ['chat-history', lessonId],
        queryFn: () => getChatHistoryApi(Number(lessonId)),
        enabled: !!lessonId,
    })
