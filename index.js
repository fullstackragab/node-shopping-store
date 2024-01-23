const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middlewares here
app.use(express.json());
app.use(cors());

// Routes here
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/api/create-checkout-session", async (req, res) => {
  const imagePath =
    "https://shopping-store-v5.netlify.app/assets/images/products/";
  const lineItems = req.body.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: ["https://han.duj.mybluehost.me/thumbs/" + item.id + ".jpg"],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "https://shopping-store-002.vercel.app/success",
    cancel_url: "https://shopping-store-002.vercel.app/cancel",
  });

  res.json({ id: session.id });
});

// Listen
app.listen(4000, () => {
  console.log("Server started at port 4000");
});
