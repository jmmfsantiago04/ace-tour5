import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  console.log('🎯 [Checkout API] Received checkout request');
  
  try {
    const body = await req.text();
    console.log('📦 [Checkout API] Raw request body:', body);

    if (!body) {
      console.error('❌ [Checkout API] Request body is empty');
      throw new Error('Request body is empty');
    }

    const parsedBody = JSON.parse(body);
    console.log('🔍 [Checkout API] Parsed request data:', {
      tripType: parsedBody.tripType,
      from: parsedBody.from,
      to: parsedBody.to,
      passengers: parsedBody.passengers,
      price: parsedBody.price
    });

    const {
      tripType,
      from,
      to,
      departingDate,
      returningDate,
      departureTime,
      returnTime,
      passengers,
      address,
      price,
      returnUrl
    } = parsedBody;

    // Extract locale from the request URL
    const locale = req.url.split('/')[3];
    console.log('📍 [Checkout API] Detected locale:', locale);

    console.log('💳 [Checkout API] Creating Stripe checkout session...');
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_creation: 'always',
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tripType === 'one-way' ? 'One Way' : 'Round Trip'} - ${from} to ${to}`,
              description: `${departingDate} ${departureTime}${returningDate ? ` - Return: ${returningDate} ${returnTime}` : ''}`,
            },
            unit_amount: Math.round(parseFloat(price) * 100), // Convert price to cents
          },
          quantity: passengers,
        },
      ],
      mode: 'payment',
      metadata: {
        tripType,
        from,
        to,
        departingDate,
        returningDate,
        departureTime,
        returnTime,
        passengers: passengers.toString(),
        address,
      },
      success_url: `${req.headers.get('origin')}/${locale}/shuttle-service?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/${locale}${returnUrl}`,
    });

    console.log('✅ [Checkout API] Session created successfully:', {
      id: session.id,
      metadata: session.metadata,
      customer_email: session.customer_email,
      url: session.url
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ [Checkout API] Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { error: 'Error creating checkout session', details: err.message },
      { status: 500 }
    );
  }
} 