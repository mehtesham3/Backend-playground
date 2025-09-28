// orderService.js
import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());

let channel;
const queue = "order_placed";

const connectRabbit = async () => {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
};
connectRabbit();

app.post("/order", async (req, res) => {
  const order = {
    orderId: Date.now().toString(),
    userId: req.body.userId,
    items: req.body.items,
    total: req.body.total,
    status: "PENDING",
  };

  // Save to DB here (skipped for demo)

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
  console.log("📤 OrderPlaced event sent:", order);

  res.status(201).json({ message: "Order received", orderId: order.orderId });
});

app.listen(4000, () => console.log("🚀 Order Service on port 4000"));
