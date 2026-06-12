import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendChatMessageApi } from '@/api/chat.api'

export const useSendChatMessage = (lessonId?: number) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (message: string) => sendChatMessageApi({ lessonId: Number(lessonId), message }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-history', lessonId] })
        },
    })
}
