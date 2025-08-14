// backend/controllers/payment.js
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Qi0z8KDiXgzbsukGd2eYDTSIhUXFJEZ1NjHEaYFhTumq8bwWPuOF5AAiNeru6iWiXjSX8zHtK45GlI00Ak2tSYm00eUhHnnxg'); // replace with your secret key

async function createPaymentIntent(req, res) {
  const { cart } = req.body; // amount in cents, e.g. 1000 = $10
   try {
    // Create Stripe line items
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: item.price * 100, // Stripe expects price in cents
      },
      quantity: item.quantity || 1, // fallback if quantity is missing
    }));

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/success", // or your frontend success page
      cancel_url: "http://localhost:5173/cancel",
    });
    console.log("Stripe session ID:", session.id);

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
}

module.exports = { createPaymentIntent };
