import axiosClient from './axiosClient'

export type CheckoutPlan = 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL'

export const createCheckoutSessionApi = (plan: CheckoutPlan) =>
    axiosClient
        .post<{ checkoutUrl: string }>('/api/payments/checkout', { plan })
        .then((res) => res.data)

