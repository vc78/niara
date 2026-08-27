# Razorpay Payment Integration Guide

## Overview
This application now includes Razorpay payment gateway integration, allowing customers to make secure online payments using multiple payment methods including Credit/Debit Cards, UPI, Netbanking, and more.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the `frontend` directory with the following:

```
VITE_RAZORPAY_KEY_ID=rzp_test_TDnNEoRLz2m96G
```

**Note:** The `.env.local` file is excluded from git (in `.gitignore`). Only the KEY_ID is stored in the frontend for security reasons.

### 2. Installation
The Razorpay package has already been installed:
```bash
npm install razorpay
```

## Payment Flow

### Available Payment Methods
1. **Razorpay** (Default) - Secure online payment gateway
2. **UPI Manual** - Manual UPI payment with QR code
3. **Cash on Delivery (COD)** - Pay when order arrives

### Checkout Steps

#### Step 1: Add to Cart
- Browse products and add items to your cart
- Cart shows selected items with sizes and quantities

#### Step 2: Delivery Details
- Enter name, email, phone, and delivery address
- Use "Current Location" button for auto-detection
- Verify city, state, and pincode

#### Step 3: Payment Selection
- Choose payment method (Razorpay is recommended)
- For Razorpay: Click "💳 Pay with Razorpay"
- For UPI Manual: Enter UPI ID or scan QR code
- For COD: Confirm payment on delivery

#### Step 4: Order Confirmation
- Upon successful payment, order details are sent via:
  - Email notification
  - WhatsApp message
- Customer receives order confirmation

## Technical Details

### Files Modified/Created

1. **`frontend/src/utils/razorpayService.js`** - New utility file
   - `initializeRazorpay()` - Loads Razorpay script
   - `handleRazorpayPayment()` - Initiates payment
   - `generateRazorpayOrderId()` - Generate order IDs (mock implementation)

2. **`frontend/src/components/CartDrawer.jsx`** - Updated component
   - Added `paymentMethod` state with 'razorpay' as default
   - Added `isProcessingPayment` state for loading
   - Added `handleRazorpayCheckout()` function
   - Updated payment methods UI with Razorpay option
   - Integrated EmailJS for order confirmation
   - Integrated WhatsApp order notification

3. **`frontend/.env.local`** - New configuration file
   - Stores Razorpay KEY_ID (excluded from git)

## Features

✅ **Secure Payment Processing**
- All payment data handled by Razorpay's secure servers
- PCI DSS compliant
- SSL encrypted transactions

✅ **Multiple Payment Options**
- Credit/Debit Cards
- UPI
- Netbanking
- Digital Wallets
- And more...

✅ **Order Management**
- Automatic email notifications with order details
- WhatsApp integration for order status updates
- Payment ID tracking
- Order summary with discount and delivery charges

✅ **User Experience**
- Quick and easy checkout process
- Pre-filled customer information
- Multiple retry options
- Clear payment status indicators

## Testing

### Test Credentials
- **Mode:** Test mode (rzp_test_*)
- **Test Card:** Use any Razorpay test card
  - Card Number: 4111111111111111
  - Expiry: Any future date
  - CVV: Any 3 digits
  - OTP: 123456 (when prompted)

### Test UPI
- Any UPI ID works in test mode
- Or use QR code manual payment option

## Backend Integration (Future)

For production, implement:

1. **Order Creation API**
   ```javascript
   POST /api/create-order
   Body: { amount, description, customer_details }
   Response: { order_id, amount, currency }
   ```

2. **Payment Verification API**
   ```javascript
   POST /api/verify-payment
   Body: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
   Response: { success: true/false }
   ```

3. **Key Secret Protection**
   - KEY_SECRET should ONLY be on backend
   - Never expose in frontend code

## Coupon Codes

Available test coupon codes:
- `FESTIVE20` - 20% discount
- `CHOWDARY20` - 20% discount
- `CHOWDARY15` - 15% discount

## Contact & Support

For order issues:
- **Phone/WhatsApp:** +91 9032306961
- **Email:** contact@sreevastra.com

## Security Best Practices

⚠️ **DO NOT:**
- Commit `.env.local` to git
- Share Razorpay KEY_SECRET
- Store payment data locally
- Use test keys in production

✅ **DO:**
- Keep KEY_ID in environment variables
- Verify payments on backend
- Use HTTPS only in production
- Log transaction IDs for audit trail

---

**Last Updated:** 2026-08-27
**Version:** 1.0.0
