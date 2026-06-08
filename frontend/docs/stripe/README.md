# Stripe Sprint Handoff

## Implemented today
- Stripe checkout flow in the backend
- Webhook endpoint at `/api/webhooks/stripe`
- Stripe customer creation and persistence on `User.stripeCustomerId`
- Checkout session creation with:
  - `clientReferenceId`
  - `metadata.plan`
  - subscription mode
  - success/cancel URLs
- Backend logic to map plan → subscription tier:
  - `PREMIUM_MONTHLY`
  - `PREMIUM_ANNUAL`
- Billing page and checkout redirect flow on the frontend
- Frontend auth refresh flow after returning from Stripe
- Protected route hydration from the backend user profile

## Current error
The webhook for `checkout.session.completed` is still failing in the backend with:

```text
400 BAD_REQUEST "Unable to deserialize Stripe event"
```

Earlier logs also showed:

```text
Stripe checkout.session.completed is missing clientReferenceId or plan metadata
```

## Important finding
The raw Stripe payload **does contain** both expected fields:

- `client_reference_id: "4"`
- `metadata.plan: "PREMIUM_MONTHLY"`

So the issue is **not** Stripe omitting the data.

## What this means
The webhook handler is failing before it can reliably parse the `checkout.session.completed` object and update the user’s `subscriptionTier` in the database.

Because of that:

- DB `subscriptionTier` is not being updated
- frontend still shows `FREE` after payment
- premium course access remains locked
- logout/login can still return `FREE` if the DB update never happened

## What needs to happen next
1. Fix webhook parsing for `checkout.session.completed`
2. Confirm the handler reads:
   - `clientReferenceId`
   - `metadata.plan`
3. Confirm the user is saved with the correct tier in the DB
4. Verify login returns a JWT with the updated `subscriptionTier`
5. Re-test the full payment flow

## Debug checklist for the next teammate
- [ ] Confirm webhook handler receives `checkout.session.completed`
- [ ] Inspect what object Stripe SDK returns for the event
- [ ] Ensure session parsing reads `client_reference_id` and `metadata.plan`
- [ ] Confirm `userRepository.save(...)` / `saveAndFlush(...)` executes
- [ ] Check the DB row for `subscription_tier`
- [ ] Check login flow uses the fresh DB user, not stale state
- [ ] Re-test the full payment flow after the fix

