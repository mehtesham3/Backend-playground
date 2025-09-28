// notificationService.js
import amqp from "amqplib";

const queues = ["order_placed", "payment_confirmed"];

const run = async () => {
  try {

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    for (const q of queues) {
      await channel.assertQueue(q, { durable: true });
      channel.consume(q, (msg) => {
        const event = JSON.parse(msg.content.toString());
        console.log(`📩 Notification Service received [${q}]:`, event);

        if (q === "order_placed") {
          console.log(`✅ Notifying user: Your order ${event.orderId} has been placed.`);
        } else if (q === "payment_confirmed") {
          console.log(`✅ Notifying user: Payment successful for order ${event.orderId}.`);
        }

        channel.ack(msg);
      });
    }
  } catch (error) {
    console.error(error.message)
  }
};

run();
