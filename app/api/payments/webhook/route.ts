import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleStripeWebhook } from '@/lib/stripe-service';
import stripe from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    await handleStripeWebhook(event);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
