# Razorpay Integration Setup Guide

## Overview
This guide explains how to set up Razorpay payment integration for token purchases in the company dashboard.

## Prerequisites
1. Razorpay account (Sign up at https://razorpay.com/)
2. Razorpay API keys (Key ID and Secret Key)

## Setup Steps

### 1. Get Razorpay API Keys
1. Log in to your Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Test/Live API keys
4. Copy your **Key ID** (starts with `rzp_test_` or `rzp_live_`)

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**Important:** Never commit your Secret Key to the frontend. Secret keys should only be used on your backend server.

### 3. Backend Setup (Required for Production)

For production, you MUST implement backend endpoints:

#### Create Order Endpoint (`/api/razorpay/create-order`)
```javascript
// Example Node.js/Express endpoint
app.post('/api/razorpay/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  
  const razorpay = require('razorpay');
  const instance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const options = {
    amount: amount, // amount in paise
    currency: currency || 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await instance.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Verify Payment Endpoint (`/api/razorpay/verify-payment`)
```javascript
// Example Node.js/Express endpoint
const crypto = require('crypto');

app.post('/api/razorpay/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const secret = process.env.RAZORPAY_SECRET_KEY;
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false, error: 'Invalid signature' });
  }
});
```

### 4. Update Frontend Code

In `src/pages/company-dashboard/tokens.tsx`, uncomment and update the backend API calls:

```typescript
// Replace mock order creation with actual API call
const { orderId } = await fetch('/api/razorpay/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: pkg.price * 100, currency: 'INR' }),
}).then(res => res.json());

// Replace mock verification with actual API call
const verified = await fetch('/api/razorpay/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(response),
}).then(res => res.json());
```

## Testing

### Test Cards (Test Mode)
Use these cards for testing:

- **Success:** `4111 1111 1111 1111`
- **Failure:** `4000 0000 0000 0002`
- **3D Secure:** `4012 0010 3714 1112`

CVV: Any 3 digits  
Expiry: Any future date  
Name: Any name

## Security Notes

⚠️ **CRITICAL SECURITY REQUIREMENTS:**

1. **Never expose Secret Key in frontend code**
2. **Always verify payments on backend** using signature verification
3. **Use HTTPS** in production
4. **Validate amounts** on backend before creating orders
5. **Store payment records** in your database for audit

## Current Implementation

The current implementation uses:
- ✅ Dynamic Razorpay script loading
- ✅ Payment modal integration
- ✅ Success/Error handling
- ✅ Token addition after successful payment
- ⚠️ Mock order creation (needs backend)
- ⚠️ Mock payment verification (needs backend)

## Support

For Razorpay API documentation, visit: https://razorpay.com/docs/

