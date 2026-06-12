import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clearChatHistoryApi } from '@/api/chat.api'

export const useClearChatHistory = (lessonId?: number) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => clearChatHistoryApi(Number(lessonId)),
        onSuccess: () => {
            queryClient.setQueryData(['chat-history', lessonId], [])
            queryClient.invalidateQueries({ queryKey: ['chat-history', lessonId] })
        },
    })
}
