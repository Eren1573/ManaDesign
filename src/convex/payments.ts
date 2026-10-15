// Payment gateway bridge
// Demo mode marks paid locally; live mode connects to checkout gateway

export async function startCheckout(
  ctx: any,
  args: { orderId: string; userId: string }
): Promise<{ success: boolean; checkoutUrl?: string; paid: boolean }> {
  // PAYMENTS_ENABLED check (default false in demo/studio mode)
  const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === 'true';

  if (!PAYMENTS_ENABLED) {
    // In demo mode: instantly complete the order
    if (ctx?.runMutation) {
      await ctx.runMutation('orders:markPaid', {
        orderId: args.orderId,
        userId: args.userId,
      });
    }
    return {
      success: true,
      paid: true,
    };
  }

  // If live payments enabled, return hosted gateway URL
  /*
  // Razorpay / UPI Integration Placeholder (Live Indian gateway - disabled by default)
  // const razorpay = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET,
  // });
  // const rzpOrder = await razorpay.orders.create({
  //   amount: args.amountCents,
  //   currency: 'INR',
  //   receipt: args.orderId,
  //   notes: { userId: args.userId }
  // });
  // return { success: true, paid: false, razorpayOrderId: rzpOrder.id };
  */

  return {
    success: true,
    paid: false,
    checkoutUrl: `https://checkout.manadesign.studio/pay/${args.orderId}`,
  };
}

