export interface ZainCashConfig {
  merchantId: string;
  apiKey: string;
  redirectUrl: string;
  testMode: boolean;
}

export interface ZainCashPaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customData?: Record<string, any>;
}

export interface ZainCashPaymentResponse {
  transactionId: string;
  redirectUrl: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
}

export interface ZainCashWebhookPayload {
  transactionId: string;
  orderId: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  timestamp: string;
  signature: string;
}

export const ZAIN_CASH_CONFIG: ZainCashConfig = {
  merchantId: process.env.NEXT_PUBLIC_ZAIN_MERCHANT_ID || '',
  apiKey: process.env.ZAIN_CASH_API_KEY || '',
  redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/zain-callback`,
  testMode: process.env.NODE_ENV === 'development',
};
