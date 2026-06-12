import { type FormEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Bot, Send, Trash2 } from 'lucide-react'
import { useChatHistory } from '@/hooks/useChatHistory'
import { useClearChatHistory } from '@/hooks/useClearChatHistory'
import { useSendChatMessage } from '@/hooks/useSendChatMessage'

interface LessonChatProps {
    lessonId: number
}

const LessonChat = ({ lessonId }: LessonChatProps) => {
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { data: messages = [], isLoading, isError } = useChatHistory(lessonId)
    const sendMessageMutation = useSendChatMessage(lessonId)
    const clearHistoryMutation = useClearChatHistory(lessonId)
    const sendErrorMessage = axios.isAxiosError(sendMessageMutation.error)
        ? sendMessageMutation.error.code === 'ECONNABORTED'
            ? 'The request took too long. Please try again.'
            : sendMessageMutation.error.response?.data?.message
        : undefined

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, sendMessageMutation.isPending])

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmedMessage = message.trim()
        if (!trimmedMessage || sendMessageMutation.isPending) {
            return
        }

        sendMessageMutation.mutate(trimmedMessage, {
            onSuccess: () => setMessage(''),
        })
    }

    return (
        <section className="overflow-hidden rounded-xl border border-white/5 bg-[#13151f]">
            <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                        <Bot size={18} />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-white">Ask Learnix AI</h2>
                        <p className="truncate text-xs text-white/35">Ask questions about this lesson</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => clearHistoryMutation.mutate()}
                    disabled={messages.length === 0 || clearHistoryMutation.isPending || sendMessageMutation.isPending}
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Clear chat history"
                    title="Clear chat history"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="max-h-[calc(100vh-20rem)] min-h-72 space-y-3 overflow-y-auto px-4 py-4 sm:px-6 xl:min-h-[24rem]">
                {isLoading && (
                    <div className="space-y-3">
                        <div className="h-12 w-3/4 animate-pulse rounded-lg bg-white/5" />
                        <div className="ml-auto h-12 w-2/3 animate-pulse rounded-lg bg-white/5" />
                    </div>
                )}

                {isError && <p className="text-center text-xs text-red-400">Could not load chat history.</p>}

                {!isLoading && !isError && messages.length === 0 && (
                    <div className="flex min-h-40 flex-col items-center justify-center text-center">
                        <Bot size={24} className="mb-3 text-white/20" />
                        <p className="text-sm text-white/50">No messages yet</p>
                        <p className="mt-1 text-xs text-white/30">Ask for an explanation, example, or summary.</p>
                    </div>
                )}

                {messages.map((chatMessage) => (
                    <div
                        key={chatMessage.id}
                        className={`flex ${chatMessage.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-6 ${
                                chatMessage.role === 'USER'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-white/70'
                            }`}
                        >
                            {chatMessage.content}
                        </div>
                    </div>
                ))}

                {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                        <div className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/40">Thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/5 p-4 sm:p-5">
                <div className="flex items-end gap-3">
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Ask a question about this lesson..."
                        maxLength={2000}
                        rows={2}
                        className="min-h-11 flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-500/60"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || sendMessageMutation.isPending}
                        className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Send message"
                    >
                        <Send size={17} />
                    </button>
                </div>
                {sendMessageMutation.isError && (
                    <p className="mt-2 text-xs text-red-400">
                        {sendErrorMessage ?? 'The AI assistant could not answer. Please try again.'}
                    </p>
                )}
                {clearHistoryMutation.isError && (
                    <p className="mt-2 text-xs text-red-400">Could not clear chat history. Please try again.</p>
                )}
            </form>
        </section>
    )
}

export default LessonChat
