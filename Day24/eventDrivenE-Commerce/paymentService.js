// paymentService.js
import amqp from "amqplib";

const orderQueue = "order_placed";
const paymentQueue = "payment_confirmed";

const run = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(orderQueue, { durable: true });
  await channel.assertQueue(paymentQueue, { durable: true });

  console.log("💳 Payment Service waiting for orders...");

  channel.consume(orderQueue, (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log("💳 Processing payment for order:", order.orderId);

    // Simulate success
    const paymentEvent = { orderId: order.orderId, status: "SUCCESS" };
    channel.sendToQueue(paymentQueue, Buffer.from(JSON.stringify(paymentEvent)));
    console.log("📤 PaymentConfirmed event sent:", paymentEvent);

    channel.ack(msg);
  });
};

run();
