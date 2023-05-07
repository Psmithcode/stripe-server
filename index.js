const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY);

app.use(express.static("./public"));
app.use(express.json());

app.use(
  cors({
    origin: 'https://candid-toffee-fe984e.netlify.app',
  })
);

app.post("/checkout", async (req, res) => {
  console.log(req.body);
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://candid-toffee-fe984e.netlify.app/success",
    cancel_url: "https://candid-toffee-fe984e.netlify.app/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(4000, () => console.log("Listening on port 4000!"));
