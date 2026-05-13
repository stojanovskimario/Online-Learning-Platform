import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/api/auth.api'
import { setCredentials } from '@/store/authSlice'
import type { AppDispatch } from '@/store/store'
import { Button } from '@/components/ui/button'

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const mutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            dispatch(setCredentials({ user: data.user, token: data.accessToken }))
            navigate('/dashboard')
        },
    })

    const onSubmit = (data: FormData) => mutation.mutate(data)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign in to Learnix</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {mutation.isError && (
                        <p className="text-red-500 text-sm">Invalid email or password.</p>
                    )}

                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage