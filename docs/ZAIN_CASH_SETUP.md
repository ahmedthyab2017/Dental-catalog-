# Zain Cash Integration

## Setup

### 1. Get Credentials
Visit: https://docs.zaincash.iq/

You'll need:
- Merchant ID
- API Key

### 2. Update `.env.local`
```bash
NEXT_PUBLIC_ZAIN_MERCHANT_ID=your_merchant_id
ZAIN_CASH_API_KEY=your_api_key
```

### 3. Test Mode
In development, the system automatically uses test endpoints.

## Implementation

### Payment Flow
1. User selects "Zain Cash" payment method
2. Click subscribe button
3. Creates payment request via `/api/payments/zain-checkout`
4. User is redirected to Zain Cash payment page
5. User completes payment
6. Zain Cash redirects to `/api/payments/zain-callback`
7. System verifies and updates subscription

### Webhook Handling
Zain Cash sends webhooks to `/api/payments/zain-verify`

## API Routes

### POST `/api/payments/zain-checkout`
Create payment request
- Auth required: Yes
- Body: `{ planId: string, billingCycle: 'monthly' | 'annual' }`
- Returns: `{ transactionId, redirectUrl, amount }`

### GET `/api/payments/zain-callback`
Handle payment callback
- Query: `?transactionId=xxx`
- Auto-redirects to billing page with status

### POST `/api/payments/zain-verify`
Webhook verification
- Body: `{ transactionId, orderId, status, amount }`
- Updates subscription on success

## Currency
- **Zain Cash**: IQD (Iraqi Dinar)
- **Stripe**: USD
- Amounts stored in smallest unit (fils for IQD)

## Currencies in Code
```typescript
// IQD amounts in fils
Pro: 15,000 fils = 15 IQD per month
Enterprise: 49,000 fils = 49 IQD per month

// USD amounts in cents
Pro: 1500 cents = $15 per month
Enterprise: 4900 cents = $49 per month
```
