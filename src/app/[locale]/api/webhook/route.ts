import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log('🎯 [Webhook] Received webhook request');
  console.log('📨 [Webhook] Request URL:', req.url);
  console.log('🔍 [Webhook] Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    const body = await req.text();
    console.log('📦 [Webhook] Raw request body:', body);
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ [Webhook] No stripe signature found');
      return NextResponse.json(
        { error: 'No stripe signature found' },
        { status: 400 }
      );
    }

    console.log('🔐 [Webhook] Verifying Stripe signature...');
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('❌ [Webhook] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ [Webhook] Signature verified. Processing event:', {
      type: event.type,
      id: event.id
    });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 [Webhook] Processing completed checkout session:', {
          id: session.id,
          customer_details: {
            email: session.customer_details?.email,
            name: session.customer_details?.name
          },
          metadata: session.metadata
        });
        
        try {
          console.log('🔍 [Webhook] Retrieving payment details...');
          const paymentIntent = session.payment_intent as string;
          const payment = await stripe.paymentIntents.retrieve(paymentIntent);
          
          console.log('💰 [Webhook] Payment details retrieved:', {
            id: payment.id,
            status: payment.status,
            amount: payment.amount
          });
          
          const bookingData = {
            stripeId: session.id,
            customerEmail: session.customer_details?.email || '',
            customerName: session.customer_details?.name || null,
            tripType: session.metadata?.tripType || 'one-way',
            from: session.metadata?.from || '',
            to: session.metadata?.to || '',
            departingDate: new Date(session.metadata?.departingDate || ''),
            returningDate: session.metadata?.returningDate ? new Date(session.metadata.returningDate) : null,
            departureTime: session.metadata?.departureTime || '',
            returnTime: session.metadata?.returnTime || null,
            passengers: parseInt(session.metadata?.passengers || '1'),
            address: session.metadata?.address || null,
            price: (session.amount_total || 0) / 100,
            status: 'CONFIRMED',
            paymentStatus: session.payment_status === 'paid' ? 'PAID' : 'PENDING',
            paymentId: payment.id,
            paymentMethod: payment.payment_method_types?.[0] || null,
            paidAt: session.payment_status === 'paid' ? new Date() : null
          };

          console.log('📝 [Webhook] Creating booking record with data:', bookingData);

          const booking = await prisma.booking.create({
            data: bookingData
          });

          console.log('✅ [Webhook] Booking created successfully:', {
            id: booking.id,
            customerEmail: booking.customerEmail,
            status: booking.status
          });
          
          return NextResponse.json({ success: true, bookingId: booking.id });
        } catch (error) {
          console.error('❌ [Webhook] Error processing checkout session:', {
            error,
            sessionId: session.id
          });
          return NextResponse.json(
            { error: 'Error processing checkout session' },
            { status: 500 }
          );
        }
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💸 [Webhook] Processing refund:', {
          id: charge.id,
          payment_intent: charge.payment_intent,
          amount_refunded: charge.amount_refunded
        });
        
        try {
          console.log('🔄 [Webhook] Updating booking status for refund...');
          const booking = await prisma.booking.updateMany({
            where: {
              paymentId: charge.payment_intent as string
            },
            data: {
              paymentStatus: 'REFUNDED',
              refundedAt: new Date(),
              status: 'CANCELLED'
            }
          });

          console.log('✅ [Webhook] Booking updated for refund:', booking);
          return NextResponse.json({ success: true });
        } catch (error) {
          console.error('❌ [Webhook] Error processing refund:', error);
          return NextResponse.json(
            { error: 'Error processing refund' },
            { status: 500 }
          );
        }
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ [Webhook] Processing payment failure:', {
          id: paymentIntent.id,
          error: paymentIntent.last_payment_error
        });
        
        try {
          console.log('🔄 [Webhook] Updating booking status for failed payment...');
          const booking = await prisma.booking.updateMany({
            where: {
              paymentId: paymentIntent.id
            },
            data: {
              paymentStatus: 'FAILED',
              status: 'CANCELLED'
            }
          });

          console.log('✅ [Webhook] Booking updated for failed payment:', booking);
          return NextResponse.json({ success: true });
        } catch (error) {
          console.error('❌ [Webhook] Error processing payment failure:', error);
          return NextResponse.json(
            { error: 'Error processing payment failure' },
            { status: 500 }
          );
        }
      }
      default:
        console.log('ℹ️ [Webhook] Unhandled event type:', event.type);
        return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error('❌ [Webhook] Webhook handler failed:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Needed for Stripe webhook signature verification
export const dynamic = 'force-dynamic'; 