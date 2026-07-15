import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

export async function POST(request) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        const session = await auth.api.getSession({
            headers: headersList
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (session.user?.role !== 'supporter') {
            return NextResponse.json({ error: 'Only supporters can purchase credits' }, { status: 403 })
        }

        const body = await request.json()
        const { credits, price } = body

        if (!credits || !price || credits <= 0 || price <= 0) {
            return NextResponse.json({ error: 'Invalid credit package' }, { status: 400 })
        }

        const amountInCents = Math.round(price * 100)

        const checkoutSession = await stripe.checkout.sessions.create({
          customer_email: session.user.email,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${credits} SparkRaise Credits`,
                  description: `${credits} credits for supporting campaigns on SparkRaise`,
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: {
            supporterEmail: session.user.email,
            credits: credits?.toString(),
            price: price?.toString(),
          },
          success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/payment/cancel`,
        });

        return NextResponse.json({ url: checkoutSession.url })
    } catch (err) {
        console.error('Stripe error:', err.message)
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}
