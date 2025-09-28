import express from 'express'
import bodyParser from 'body-parser'
import amqp from 'amqplib'

const app = express();
app.use(bodyParser.json());

const queue = 'order_placed';
let channel, connection;

const connectRabbit = async () => {
  try {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error(error.message);
  }
};

app.post('/order', async (req, res) => {
  const { orderId, userId, items, total } = req.body;

  const orderEvent = {
    event: "OrderPlaced",
    data: {
      orderId,
      userId,
      items,
      total,
    },
    timestamp: new Date().toISOString(),
  };
  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderEvent)), { persistent: true });
    console.log("Event published ", orderEvent);

    res.status(201).json({ message: "Order placed successfully!", orderId });
  } catch (error) {
    console.error("❌ Failed to publish event:", error);
    res.status(500).json({ error: "Could not place order" });
  }
})


app.listen(4000, async () => {
  await connectRabbit();
  console.log("server is running on port 4000");
})