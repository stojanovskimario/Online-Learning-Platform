import { useMutation } from '@tanstack/react-query'
import { createCheckoutSessionApi, type CheckoutPlan } from '@/api/payment.api'

export const useCheckout = () => {
    return useMutation({
        mutationFn: (plan: CheckoutPlan) => createCheckoutSessionApi(plan),
        onSuccess: (data) => {
            window.location.href = data.checkoutUrl
        },
    })
}



