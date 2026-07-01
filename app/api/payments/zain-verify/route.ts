import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { zainCashService } from '@/lib/zain-cash-service';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { transactionId, orderId, status, amount } = await req.json();

    // Verify payment with Zain Cash
    const paymentStatus = await zainCashService.verifyPayment(transactionId);

    if (paymentStatus.status === 'success') {
      // Extract clinic_id and plan_id from orderId
      const [clinicId, planId] = orderId.split('_');

      // Update clinic subscription
      const { error: updateError } = await supabase
        .from('clinics')
        .update({
          subscription_tier: planId as any,
          subscription_status: 'active',
        })
        .eq('id', clinicId);

      if (updateError) throw updateError;

      // Create subscription record
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert(
          {
            clinic_id: clinicId,
            plan_name: planId,
            status: 'active',
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
          { onConflict: 'clinic_id' }
        );

      if (subError) throw subError;

      // Record payment
      const { error: paymentError } = await supabase.from('payments').insert([
        {
          subscription_id: clinicId,
          amount: amount / 1000, // Convert from fils
          status: 'paid',
          payment_method: 'zain_cash',
        },
      ]);

      if (paymentError) throw paymentError;

      return NextResponse.json({
        success: true,
        message: 'Payment verified and processed',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error('Zain Cash Verification Error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
