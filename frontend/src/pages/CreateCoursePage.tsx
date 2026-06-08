import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import axios from 'axios'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import axiosClient from '../api/axiosClient'
import type { ApiErrorResponse } from '@/types/api.types'
import type { Category, Course } from '@/types/course.types'

const schema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
    description: z.string().trim().min(1, 'Description is required').max(2000, 'Description must be at most 2000 characters'),
    thumbnailUrl: z.string().trim().max(2048, 'Thumbnail URL must be at most 2048 characters').optional().or(z.literal('')),
    categoryId: z.coerce.number().int('Category is required').positive('Category is required'),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    isPremium: z.boolean(),
})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

const CreateCoursePage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => axiosClient.get<Category[]>('/api/categories').then((res) => res.data),
    })

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            thumbnailUrl: '',
            price: 0,
            isPremium: false,
        },
    })

    const mutation = useMutation({
        mutationFn: (data: {
            title: string
            description: string
            thumbnailUrl?: string
            categoryId: number
            price: number
            isPremium: boolean
        }) => axiosClient.post<Course>('/api/courses/add', data).then((res) => res.data),
        onSuccess: async (course) => {
            await queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses/${course.id}`)
        },
    })

    const backendErrorMessage = useMemo(() => {
        if (!axios.isAxiosError<ApiErrorResponse>(mutation.error)) {
            return 'Could not create course. Please try again.'
        }

        return mutation.error.response?.data?.message ?? 'Could not create course. Please try again.'
    }, [mutation.error])

    const onSubmit = (data: FormOutput) => {
        mutation.mutate({
            ...data,
            thumbnailUrl: data.thumbnailUrl?.trim() ? data.thumbnailUrl.trim() : undefined,
        })
    }

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Create Course</h1>
                        <p className="text-xs text-white/40">Add a new course for your students</p>
                    </div>
                </header>
            }
        >
            <div className="max-w-3xl">
                {(isCategoriesLoading || isCategoriesError) && (
                    <div className={`mb-4 rounded-xl border p-4 ${isCategoriesError ? 'border-red-500/20 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                        <p className={`text-xs ${isCategoriesError ? 'text-red-400' : 'text-white/40'}`}>
                            {isCategoriesError ? 'Failed to load categories.' : 'Loading categories...'}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-[#13151f] border border-white/5 rounded-xl p-5 sm:p-6">
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Title</label>
                        <input
                            {...register('title')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                            placeholder="Course title"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Description</label>
                        <textarea
                            {...register('description')}
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                            placeholder="Describe what students will learn"
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5">Category</label>
                            <select
                                {...register('categoryId')}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                disabled={isCategoriesLoading || !categories?.length}
                            >
                                <option value="">Select a category</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id} className="bg-[#13151f]">
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5">Price</label>
                            <input
                                {...register('price')}
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                                placeholder="0"
                            />
                            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Thumbnail URL</label>
                        <input
                            {...register('thumbnailUrl')}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                            placeholder="https://..."
                        />
                        {errors.thumbnailUrl && <p className="text-red-400 text-xs mt-1">{errors.thumbnailUrl.message}</p>}
                    </div>

                    <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                        <input
                            {...register('isPremium')}
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/20 bg-transparent text-blue-500 focus:ring-blue-500"
                        />
                        Premium course
                    </label>

                    {mutation.isError && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <p className="text-xs text-red-400">{backendErrorMessage}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/courses')}
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending || isCategoriesLoading || !isValid}
                            className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {mutation.isPending ? 'Creating...' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}

export default CreateCoursePage









