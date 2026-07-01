import axios from 'axios';
import { ZainCashPaymentRequest, ZainCashPaymentResponse, ZAIN_CASH_CONFIG } from './zain-cash-types';
import crypto from 'crypto';

const ZAIN_API_BASE = 'https://api.zaincash.iq/v1';
const ZAIN_TEST_API = 'https://test.zaincash.iq/v1';

class ZainCashService {
  private apiBase: string;
  private merchantId: string;
  private apiKey: string;

  constructor() {
    this.apiBase = ZAIN_CASH_CONFIG.testMode ? ZAIN_TEST_API : ZAIN_API_BASE;
    this.merchantId = ZAIN_CASH_CONFIG.merchantId;
    this.apiKey = ZAIN_CASH_CONFIG.apiKey;
  }

  /**
   * Generate signature for Zain Cash API requests
   */
  private generateSignature(data: string): string {
    return crypto.createHmac('sha256', this.apiKey).update(data).digest('hex');
  }

  /**
   * Create payment request
   */
  async createPayment(
    paymentRequest: ZainCashPaymentRequest
  ): Promise<ZainCashPaymentResponse> {
    try {
      const requestData = {
        merchant: this.merchantId,
        amount: Math.round(paymentRequest.amount * 1000), // Convert to fils
        currency: paymentRequest.currency || 'IQD',
        order_id: paymentRequest.orderId,
        redirect_url: ZAIN_CASH_CONFIG.redirectUrl,
        description: paymentRequest.description,
        custom_data: paymentRequest.customData || {},
      };

      // Generate signature
      const requestString = JSON.stringify(requestData);
      const signature = this.generateSignature(requestString);

      const response = await axios.post(`${this.apiBase}/transaction/pay`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Signature': signature,
        },
      });

      if (response.data.success) {
        return {
          transactionId: response.data.transactionId,
          redirectUrl: response.data.redirectUrl,
          status: 'pending',
          message: 'Payment created successfully',
        };
      } else {
        throw new Error(response.data.message || 'Payment creation failed');
      }
    } catch (error: any) {
      console.error('Zain Cash Payment Error:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(transactionId: string): Promise<{
    status: string;
    amount: number;
    orderId: string;
    timestamp: string;
  }> {
    try {
      const requestData = {
        merchant: this.merchantId,
        transactionId: transactionId,
      };

      const requestString = JSON.stringify(requestData);
      const signature = this.generateSignature(requestString);

      const response = await axios.post(
        `${this.apiBase}/transaction/status`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Signature': signature,
          },
        }
      );

      return {
        status: response.data.status,
        amount: response.data.amount / 1000, // Convert from fils
        orderId: response.data.order_id,
        timestamp: response.data.timestamp,
      };
    } catch (error: any) {
      console.error('Zain Cash Verification Error:', error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = this.generateSignature(payload);
    return expectedSignature === signature;
  }
}

export const zainCashService = new ZainCashService();
