import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { zainCashService } from '@/lib/zain-cash-service';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Verify payment
    const paymentStatus = await zainCashService.verifyPayment(transactionId);
    const supabase = createAdminClient();

    if (paymentStatus.status === 'success') {
      // Extract clinic_id from orderId
      const clinicId = paymentStatus.orderId.split('_')[0];

      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/dashboard/billing?payment=success&transactionId=${transactionId}`,
        req.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/dashboard/billing?payment=failed`,
        req.url)
      );
    }
  } catch (err: any) {
    console.error('Zain Cash Callback Error:', err);
    return NextResponse.redirect(
      new URL(`/dashboard/billing?payment=error&message=${err.message}`,
      req.url)
    );
  }
}
