import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '@/api/auth.api'
import { setCredentials } from '@/store/authSlice'
import type { AppDispatch } from '@/store/store'

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
        <div className="min-h-screen bg-[#0f1117] flex">
            <div className="hidden lg:flex w-1/2 bg-[#13151f] border-r border-white/5 flex-col justify-between p-12">
                <div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-blue-400">Learn</span>ix
          </span>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white leading-snug mb-4">
                        Build real skills.<br />Earn real certificates.
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed">
                        Join thousands of developers leveling up with curated courses, hands-on quizzes, and AI-powered learning tools.
                    </p>
                </div>
                <div className="flex gap-8">
                    {[['200+', 'Courses'], ['50k+', 'Students'], ['95%', 'Completion rate']].map(([val, label]) => (
                        <div key={label}>
                            <p className="text-xl font-bold text-blue-400">{val}</p>
                            <p className="text-xs text-white/30">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <div className="mb-8 lg:hidden">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-blue-400">Learn</span>ix
            </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
                    <p className="text-white/40 text-sm mb-8">Welcome back — pick up where you left off</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {mutation.isError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                                <p className="text-red-400 text-xs">Invalid email or password.</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                        >
                            {mutation.isPending ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-sm text-white/30 mt-6 text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage