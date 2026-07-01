import { createAdminClient } from '@/lib/supabase';
import stripe from '@/lib/stripe';

export async function createCheckoutSession(clinicId: string, planId: string, billingCycle: 'monthly' | 'annual' = 'monthly') {
  const supabase = createAdminClient();

  // Get clinic
  const { data: clinic, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', clinicId)
    .single();

  if (clinicError || !clinic) {
    throw new Error('Clinic not found');
  }

  // Get or create Stripe customer
  let customerId = clinic.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: clinic.email,
      metadata: {
        clinic_id: clinicId,
        clinic_name: clinic.name,
      },
    });
    customerId = customer.id;

    // Update clinic with Stripe customer ID
    await supabase
      .from('clinics')
      .update({ stripe_customer_id: customerId })
      .eq('id', clinicId);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: 'price_' + planId + (billingCycle === 'annual' ? '_annual' : ''),
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    metadata: {
      clinic_id: clinicId,
      plan_id: planId,
    },
  });

  return session.url;
}

export async function handleStripeWebhook(event: Stripe.Event) {
  const supabase = createAdminClient();

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const clinicId = subscription.metadata?.clinic_id;

      if (clinicId) {
        const planId = subscription.metadata?.plan_id || 'pro';

        await supabase
          .from('subscriptions')
          .upsert(
            {
              clinic_id: clinicId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              plan_name: planId,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000),
              current_period_end: new Date(subscription.current_period_end * 1000),
            },
            { onConflict: 'clinic_id' }
          );

        // Update clinic subscription tier
        await supabase
          .from('clinics')
          .update({ subscription_tier: planId as any })
          .eq('id', clinicId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const clinicId = subscription.metadata?.clinic_id;

      if (clinicId) {
        // Downgrade to free
        await supabase
          .from('clinics')
          .update({ subscription_tier: 'free' })
          .eq('id', clinicId);

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('clinic_id', clinicId);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Create payment record
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('clinic_id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (subscription) {
        await supabase.from('payments').insert([
          {
            subscription_id: subscription.clinic_id,
            stripe_payment_id: invoice.id,
            amount: invoice.amount_paid / 100,
            status: 'paid',
            payment_method: 'stripe',
          },
        ]);
      }
      break;
    }

    case 'invoice.payment_failed': {
      // Handle payment failure - you can send email notification
      console.error('Payment failed:', event.data.object);
      break;
    }
  }
}
