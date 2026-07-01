import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe-service';

export async function POST(req: NextRequest) {
  try {
    const { planId, billingCycle = 'monthly' } = await req.json();
    const supabase = createAdminClient();

    // Get user from request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get clinic
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('id')
      .eq('user_id', data.user.id)
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    // Create checkout session
    const checkoutUrl = await createCheckoutSession(clinic.id, planId, billingCycle);

    return NextResponse.json({ url: checkoutUrl });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
