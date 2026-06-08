import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import type { RootState } from '@/store/store'
import { setCredentials } from '@/store/authSlice'
import { getCurrentUserApi } from '@/api/auth.api'
import { useCheckout } from '@/hooks/useCheckout'
import type { CheckoutPlan } from '@/api/payment.api'

const badgeStyles = {
    FREE: 'bg-white/10 text-white/50',
    PREMIUM_MONTHLY: 'bg-blue-500/20 text-blue-300',
    PREMIUM_ANNUAL: 'bg-purple-500/20 text-purple-300',
} as const

const BillingPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const user = useSelector((state: RootState) => state.auth.user)
    const checkoutMutation = useCheckout()
    const currentTier = user?.subscriptionTier ?? 'FREE'
    const sessionStatus = searchParams.get('session')
    const isFree = currentTier === 'FREE'
    const isSuccess = sessionStatus === 'success'

    useEffect(() => {
        if (!isSuccess) {
            return
        }

        getCurrentUserApi().then((freshUser) => {
            const token = localStorage.getItem('token') ?? ''
            dispatch(setCredentials({ user: freshUser, token }))
        })
    }, [dispatch, isSuccess])

    const handleCheckout = (plan: CheckoutPlan) => {
        checkoutMutation.mutate(plan)
    }

    const isLoadingPlan = (plan: CheckoutPlan) => checkoutMutation.isPending && checkoutMutation.variables === plan

    return (
        <AppLayout
            header={
                <header className="bg-[#13151f] border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Billing</h1>
                        <p className="text-xs text-white/40">Manage your Learnix subscription</p>
                    </div>
                </header>
            }
        >
            <div className="mx-auto max-w-6xl space-y-5">
                {sessionStatus === 'success' && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                        🎉 You&apos;re now Premium! Enjoy unlimited access.
                    </div>
                )}

                {sessionStatus === 'cancel' && (
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                        Checkout was cancelled. Your plan has not changed.
                    </div>
                )}

                <div className="bg-[#13151f] border border-white/5 rounded-xl p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-white/30 mb-2">Current Plan</p>
                            <h2 className="text-xl font-semibold text-white">{currentTier.replace('_', ' ')}</h2>
                            <p className="mt-1 text-sm text-white/40">
                                {isFree ? 'You are on the Free plan.' : "You're on Premium — enjoy full access."}
                            </p>
                        </div>
                        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[currentTier]}`}>
                            {currentTier.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {isFree && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="rounded-xl border border-white/5 bg-[#13151f] p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h3 className="text-base font-semibold text-white">Free</h3>
                                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/40">Current</span>
                            </div>
                            <p className="text-3xl font-bold text-white mb-4">$0<span className="text-sm font-normal text-white/40">/month</span></p>
                            <ul className="space-y-2 text-sm text-white/60 mb-6">
                                <li>• Browse course catalogue</li>
                                <li>• 5 AI messages/day</li>
                                <li>• Certificates not included</li>
                            </ul>
                            <button disabled className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white/40 cursor-not-allowed">
                                Current Plan
                            </button>
                        </div>

                        <div className="rounded-xl border border-blue-500/50 bg-[#13151f] p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h3 className="text-base font-semibold text-white">Premium Monthly</h3>
                                <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-blue-300">Popular</span>
                            </div>
                            <p className="text-3xl font-bold text-white mb-4">$9.99<span className="text-sm font-normal text-white/40">/month</span></p>
                            <ul className="space-y-2 text-sm text-white/60 mb-6">
                                <li>• All courses unlocked</li>
                                <li>• 100 AI messages/day</li>
                                <li>• PDF Certificates</li>
                            </ul>
                            <button
                                onClick={() => handleCheckout('PREMIUM_MONTHLY')}
                                disabled={checkoutMutation.isPending}
                                className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoadingPlan('PREMIUM_MONTHLY') ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Redirecting…
                                    </span>
                                ) : (
                                    'Upgrade Monthly'
                                )}
                            </button>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-[#13151f] p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h3 className="text-base font-semibold text-white">Premium Annual</h3>
                                <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-purple-300">Save 33%</span>
                            </div>
                            <p className="text-3xl font-bold text-white mb-4">$79.99<span className="text-sm font-normal text-white/40">/year</span></p>
                            <ul className="space-y-2 text-sm text-white/60 mb-6">
                                <li>• All courses unlocked</li>
                                <li>• 100 AI messages/day</li>
                                <li>• PDF Certificates</li>
                            </ul>
                            <button
                                onClick={() => handleCheckout('PREMIUM_ANNUAL')}
                                disabled={checkoutMutation.isPending}
                                className="w-full rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoadingPlan('PREMIUM_ANNUAL') ? (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Redirecting…
                                    </span>
                                ) : (
                                    'Upgrade Annually'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {!isFree && (
                    <div className="rounded-xl border border-white/5 bg-[#13151f] p-8 text-center">
                        <p className="text-sm font-medium text-white mb-1">You&apos;re on Premium — enjoy full access.</p>
                        <p className="text-xs text-white/35">No upgrades are available while your subscription is active.</p>
                    </div>
                )}

                {checkoutMutation.isError && (
                    <div className="text-sm text-red-400">Something went wrong. Please try again.</div>
                )}
            </div>
        </AppLayout>
    )
}

export default BillingPage





