# Learnix

Learnix is a web-based learning platform that allows users to explore, enroll in, and manage online courses.

## Demo

Demo Video: https://www.youtube.com/watch?v=NYSwEs40i28

## Developed By

- Mario Spasovski 233009
- Mario Stojanovski 233057
- Filip Stankovski 233111
- Filip Cvetkovski 233183

## Technologies Used

- Java
- Spring Boot
- React
- Docker
- PostgreSQL
- Stripe
- Google Gemini AI

## Clone the Repository

```bash
git clone https://github.com/stojanovskimario/Online-Learning-Platform.git
cd Online-Learning-Platform
```

## Prerequisites

Before running the application, configure the required environment variables.

### AI Configuration (Google Gemini)

The application uses Google Gemini AI. Add the following variables in your backend environment:

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key
GOOGLE_AI_MODEL=gemini-2.5-flash
```

These are used in the application via:

```properties
google.ai.api-key=${GOOGLE_AI_API_KEY:}
google.ai.model=${GOOGLE_AI_MODEL:}
```

### Stripe Configuration

The platform uses Stripe for subscription and payment handling. Add the following environment variables:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PREMIUM_MONTHLY_PRICE_ID=your_monthly_price_id
STRIPE_PREMIUM_ANNUAL_PRICE_ID=your_annual_price_id
STRIPE_SUCCESS_URL=http://localhost:5173/billing?session=success
STRIPE_CANCEL_URL=http://localhost:5173/billing?session=cancel
```

These are mapped in the application as:

```properties
stripe.secret-key=${STRIPE_SECRET_KEY}
stripe.webhook-secret=${STRIPE_WEBHOOK_SECRET}
stripe.price-id.premium-monthly=${STRIPE_PREMIUM_MONTHLY_PRICE_ID}
stripe.price-id.premium-annual=${STRIPE_PREMIUM_ANNUAL_PRICE_ID}
stripe.success-url=${STRIPE_SUCCESS_URL:http://localhost:5173/billing?session=success}
stripe.cancel-url=${STRIPE_CANCEL_URL:http://localhost:5173/billing?session=cancel}
```

> Note: API keys and secrets are not included in this repository. You must provide your own credentials.

## Backend

Navigate to the backend directory and start the Spring Boot application:

```bash
cd backend
mvn spring-boot:run
```

The backend will be available at:

```text
http://localhost:8080/swagger-ui.html
```

## Frontend

Navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Docker

To run the complete application using Docker:

```bash
docker compose up --build
```

## Stripe Local Development Setup

### First Time Setup

Install the Stripe CLI:

https://stripe.com/docs/stripe-cli

Then log in:

```bash
stripe login
```

This opens a browser window for authentication. After logging in once, you remain authenticated on that machine.

### Running Stripe in Development

Keep the following three terminals running:

#### Terminal 1 — Backend

```bash
cd Online-Learning-Platform/backend
./mvnw spring-boot:run
```

#### Terminal 2 — Frontend

```bash
cd Online-Learning-Platform/frontend
npm run dev
```

#### Terminal 3 — Stripe Webhook Listener

```bash
stripe listen --forward-to localhost:8080/api/webhooks/stripe
```

After running the command, Stripe will generate a webhook secret beginning with:

```text
whsec_
```

Copy this value.

### Configure the Webhook Secret

Open:

```text
Online-Learning-Platform/backend/src/main/resources/application-dev.properties
```

Update:

```properties
stripe.webhook-secret=whsec_your_value_here
```

Restart the backend after making the change.

### Important Notes

- The webhook secret is machine-specific.
- Payments and subscription updates will not work correctly without a valid webhook secret.

### Testing a Payment

Open:

```text
http://localhost:5173
```

1. Log in as a FREE student (credentials available in the seed data).
2. Navigate to `/billing`.
3. Click **Upgrade Monthly**.
4. Use the Stripe test card:

```text
Card Number: 4242 4242 4242 4242
Expiry Date: 12/29
CVC: 123
Name: Any value
```

5. Complete the payment.
6. Verify that webhook events are received in the Stripe CLI terminal.
