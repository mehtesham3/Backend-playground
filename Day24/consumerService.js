//Invetry services
import amqp from "amqplib";

const queue = 'order_placed';

const consumeOrderPlaced = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  console.log("Inventory service waiting for events ", queue);

  channel.consume(queue, (msg) => {
    const event = JSON.parse(msg.content.toString());
    console.log("Inventory service recived event : ", event);

    // Example: reduce stock
    console.log(`🔻 Reducing stock for order ${event.data.orderId}`);
    channel.ack(msg);
  })
}

consumeOrderPlaced();