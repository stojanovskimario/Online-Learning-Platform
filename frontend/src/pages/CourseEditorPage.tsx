import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { getCourseByIdApi, publishCourseApi } from '@/api/courses.api'
import { createSectionApi, createLessonInSectionApi, deleteSectionApi, deleteLessonApi } from '@/api/sections.api'
import axiosClient from '@/api/axiosClient'
import type { Section } from '@/types/course.types'

const sectionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    orderIndex: z.coerce.number().int().min(1, 'Order must be at least 1'),
})

const lessonSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    orderIndex: z.coerce.number().int().min(1, 'Order must be at least 1'),
})

type SectionForm = z.infer<typeof sectionSchema>
type LessonForm = z.infer<typeof lessonSchema>

const AddSectionForm = ({ courseId, onSuccess }: { courseId: number; onSuccess: () => void }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<SectionForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(sectionSchema) as any,
        defaultValues: { orderIndex: 1 },
    })

    const mutation = useMutation({
        mutationFn: (data: SectionForm) => createSectionApi(courseId, data),
        onSuccess: () => { reset(); onSuccess() },
    })

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-3">
            <div className="flex gap-3">
                <div className="flex-1">
                    <input
                        {...register('title')}
                        placeholder="Section title"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div className="w-24">
                    <input
                        {...register('orderIndex')}
                        type="number"
                        placeholder="Order"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {errors.orderIndex && <p className="text-red-400 text-xs mt-1">{errors.orderIndex.message}</p>}
                </div>
            </div>
            {mutation.isError && <p className="text-red-400 text-xs">Failed to create section.</p>}
            <Button type="submit" disabled={mutation.isPending} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                {mutation.isPending ? 'Adding...' : 'Add Section'}
            </Button>
        </form>
    )
}

const EditSectionForm = ({ section, onSuccess, onCancel }: {
    section: Section
    onSuccess: () => void
    onCancel: () => void
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<SectionForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(sectionSchema) as any,
        defaultValues: { title: section.title, orderIndex: section.orderIndex },
    })

    const mutation = useMutation({
        mutationFn: (data: SectionForm) =>
            axiosClient.put(`/api/sections/${section.id}`, data).then((res) => res.data),
        onSuccess: () => onSuccess(),
    })

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex gap-3 items-start flex-1">
            <div className="flex-1">
                <input
                    {...register('title')}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="w-20">
                <input
                    {...register('orderIndex')}
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
            </div>
            {mutation.isError && <p className="text-red-400 text-xs">Failed.</p>}
            <button type="submit" disabled={mutation.isPending}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-all">
                {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onCancel}
                    className="text-xs border border-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-all">
                Cancel
            </button>
        </form>
    )
}

const AddLessonForm = ({ section, onSuccess }: { section: Section; onSuccess: () => void }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LessonForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(lessonSchema) as any,
        defaultValues: { orderIndex: (section.lessons?.length ?? 0) + 1 },
    })

    const mutation = useMutation({
        mutationFn: (data: LessonForm) => createLessonInSectionApi(section.id, data),
        onSuccess: () => { reset(); onSuccess() },
    })

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="mt-3 space-y-3 bg-white/[0.02] border border-white/5 rounded-lg p-4">
            <p className="text-xs font-medium text-white/50">New lesson in "{section.title}"</p>
            <div className="flex gap-3">
                <div className="flex-1">
                    <input
                        {...register('title')}
                        placeholder="Lesson title"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div className="w-24">
                    <input
                        {...register('orderIndex')}
                        type="number"
                        placeholder="Order"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {errors.orderIndex && <p className="text-red-400 text-xs mt-1">{errors.orderIndex.message}</p>}
                </div>
            </div>
            <div>
                <textarea
                    {...register('content')}
                    placeholder="Lesson content (Markdown supported)"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
                {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
            </div>
            {mutation.isError && <p className="text-red-400 text-xs">Failed to create lesson.</p>}
            <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                    {mutation.isPending ? 'Adding...' : 'Add Lesson'}
                </Button>
                <button type="button" onClick={() => reset()}
                        className="text-xs border border-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-all">
                    Cancel
                </button>
            </div>
        </form>
    )
}

const EditLessonForm = ({ lesson, onSuccess, onCancel }: {
    lesson: { id: number; title: string; orderIndex: number; markdownContent: string }
    onSuccess: () => void
    onCancel: () => void
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LessonForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(lessonSchema) as any,
        defaultValues: { title: lesson.title, content: lesson.markdownContent, orderIndex: lesson.orderIndex },
    })

    const mutation = useMutation({
        mutationFn: (data: LessonForm) =>
            axiosClient.put(`/api/lessons/${lesson.id}`, data).then((res) => res.data),
        onSuccess: () => onSuccess(),
    })

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="px-5 py-4 space-y-3 bg-white/[0.02] border-t border-white/5">
            <p className="text-xs font-medium text-white/50">Editing lesson</p>
            <div className="flex gap-3">
                <div className="flex-1">
                    <input
                        {...register('title')}
                        placeholder="Lesson title"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div className="w-24">
                    <input
                        {...register('orderIndex')}
                        type="number"
                        placeholder="Order"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    {errors.orderIndex && <p className="text-red-400 text-xs mt-1">{errors.orderIndex.message}</p>}
                </div>
            </div>
            <textarea
                {...register('content')}
                placeholder="Lesson content (Markdown supported)"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
            />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
            {mutation.isError && <p className="text-red-400 text-xs">Failed to update lesson.</p>}
            <div className="flex gap-2">
                <button type="submit" disabled={mutation.isPending}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-all">
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={onCancel}
                        className="text-xs border border-white/10 text-white/50 hover:text-white px-3 py-1.5 rounded-lg transition-all">
                    Cancel
                </button>
            </div>
        </form>
    )
}

const CourseEditorPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [activeLessonForm, setActiveLessonForm] = useState<number | null>(null)
    const [editingSection, setEditingSection] = useState<number | null>(null)
    const [editingLesson, setEditingLesson] = useState<number | null>(null)
    const [showSectionForm, setShowSectionForm] = useState(false)

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['course', id],
        queryFn: () => getCourseByIdApi(Number(id)),
        enabled: !!id,
    })

    const publishMutation = useMutation({
        mutationFn: () => publishCourseApi(Number(id)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['course', id] }),
    })

    const deleteSectionMutation = useMutation({
        mutationFn: (sectionId: number) => deleteSectionApi(sectionId),
        onSuccess: () => refetch(),
    })

    const deleteLessonMutation = useMutation({
        mutationFn: (lessonId: number) => deleteLessonApi(lessonId),
        onSuccess: () => refetch(),
    })

    const refetch = () => queryClient.invalidateQueries({ queryKey: ['course', id] })

    const sortedSections = [...(course?.sections ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <button onClick={() => navigate(`/courses/${id}`)}
                                className="text-white/30 hover:text-white text-sm transition-colors mb-0.5 block">
                            ← Back to course
                        </button>
                        <h1 className="text-lg font-semibold text-white">{course?.title ?? 'Course Editor'}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            course?.status === 'PUBLISHED'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {course?.status ?? '—'}
                        </span>
                        {course?.status === 'DRAFT' && (
                            <Button
                                size="sm"
                                onClick={() => publishMutation.mutate()}
                                disabled={publishMutation.isPending}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                {publishMutation.isPending ? 'Publishing...' : 'Publish Course'}
                            </Button>
                        )}
                        {course?.status === 'PUBLISHED' && (
                            <span className="text-xs text-green-400">✓ Live</span>
                        )}
                    </div>
                </header>
            }
        >
            {isLoading && (
                <div className="space-y-3 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-white/5 rounded-xl" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400 text-sm">Failed to load course.</p>
                </div>
            )}

            {course && (
                <div className="max-w-3xl space-y-4">
                    {sortedSections.length === 0 && (
                        <div className="bg-[#13151f] border border-white/5 rounded-xl p-8 text-center">
                            <p className="text-white/30 text-sm">No sections yet — add one below</p>
                        </div>
                    )}

                    {sortedSections.map((section) => {
                        const sortedLessons = [...(section.lessons ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
                        const isAddingLesson = activeLessonForm === section.id
                        const isEditingThisSection = editingSection === section.id

                        return (
                            <div key={section.id} className="bg-[#13151f] border border-white/5 rounded-xl overflow-hidden">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 gap-3">
                                    {isEditingThisSection ? (
                                        <EditSectionForm
                                            section={section}
                                            onSuccess={() => { setEditingSection(null); refetch() }}
                                            onCancel={() => setEditingSection(null)}
                                        />
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-xs text-white/20 font-mono flex-shrink-0">
                                                    {String(section.orderIndex).padStart(2, '0')}
                                                </span>
                                                <h3 className="text-sm font-semibold text-white truncate">{section.title}</h3>
                                                <span className="text-xs text-white/30 flex-shrink-0">
                                                    {sortedLessons.length} lesson{sortedLessons.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => setEditingSection(section.id)}
                                                    className="text-xs border border-white/10 text-white/50 hover:text-white hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete section "${section.title}" and all its lessons?`)) {
                                                            deleteSectionMutation.mutate(section.id)
                                                        }
                                                    }}
                                                    disabled={deleteSectionMutation.isPending}
                                                    className="text-xs border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => setActiveLessonForm(isAddingLesson ? null : section.id)}
                                                    className="text-xs border border-white/10 text-white/50 hover:text-white hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    {isAddingLesson ? 'Cancel' : '+ Add Lesson'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="divide-y divide-white/5">
                                    {sortedLessons.map((lesson, lIndex) => (
                                        <div key={lesson.id}>
                                            <div className="px-5 py-3 flex items-center gap-3 group">
                                                <span className="text-xs text-white/20 font-mono w-8">
                                                    {section.orderIndex}.{lIndex + 1}
                                                </span>
                                                <span className="text-sm text-white/60 flex-1">{lesson.title}</span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)}
                                                        className="text-xs text-white/40 hover:text-white"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Delete lesson "${lesson.title}"?`)) {
                                                                deleteLessonMutation.mutate(lesson.id)
                                                            }
                                                        }}
                                                        disabled={deleteLessonMutation.isPending}
                                                        className="text-xs text-red-400/50 hover:text-red-400"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            {editingLesson === lesson.id && (
                                                <EditLessonForm
                                                    lesson={lesson}
                                                    onSuccess={() => { setEditingLesson(null); refetch() }}
                                                    onCancel={() => setEditingLesson(null)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {isAddingLesson && (
                                    <div className="px-5 pb-5">
                                        <AddLessonForm
                                            section={section}
                                            onSuccess={() => { setActiveLessonForm(null); refetch() }}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <div className="bg-[#13151f] border border-white/5 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">Add Section</h3>
                        </div>
                        {showSectionForm ? (
                            <AddSectionForm
                                courseId={Number(id)}
                                onSuccess={() => { setShowSectionForm(false); refetch() }}
                            />
                        ) : (
                            <button
                                onClick={() => setShowSectionForm(true)}
                                className="w-full border border-dashed border-white/10 rounded-lg py-3 text-sm text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
                            >
                                + Add a new section
                            </button>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    )
}

export default CourseEditorPage