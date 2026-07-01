import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { zainCashService } from '@/lib/zain-cash-service';

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { planId, billingCycle = 'monthly' } = body;

    // Get user from request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get clinic
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // Get plan price
    const plans: { [key: string]: number } = {
      pro: billingCycle === 'monthly' ? 15000 : 150000, // in fils
      enterprise: billingCycle === 'monthly' ? 49000 : 490000,
    };

    const amount = plans[planId];
    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create Zain Cash payment request
    const orderId = `${clinic.id}_${planId}`;
    const paymentResponse = await zainCashService.createPayment({
      amount: amount / 1000, // Convert to IQD
      currency: 'IQD',
      orderId: orderId,
      description: `Subscription to ${planId} plan - ${clinic.name}`,
      customData: {
        clinic_id: clinic.id,
        clinic_name: clinic.name,
        plan_id: planId,
        user_email: authData.user.email,
      },
    });

    return NextResponse.json({
      transactionId: paymentResponse.transactionId,
      redirectUrl: paymentResponse.redirectUrl,
      amount: amount,
    });
  } catch (err: any) {
    console.error('Zain Cash Checkout Error:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
