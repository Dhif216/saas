import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as any,
});

export const paymentService = {
  async createPaymentIntent(amount: number, orderId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId,
      },
    });
    return paymentIntent;
  },

  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  },

  async createCustomer(email: string, name: string) {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  },

  async createPaymentMethod(
    customerId: string,
    token: string
  ) {
    // In production, use Stripe.js to create payment methods securely
    // This is a placeholder for the actual implementation
    return null;
  },

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  },
};
