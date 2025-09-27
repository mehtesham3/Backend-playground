import amqp from "amqplib"

const queue = 'task_queue';
const msg = process.argv.slice(2).join(" ") || "Hello RabbitMQ!";

async function sendMessage() {
  try {
    //Connect 
    const Connection = await amqp.connect("amqp://localhost");
    const channel = await Connection.createChannel();

    //Create Queue
    await channel.assertQueue(queue, { durable: true });

    //Send Message
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log(" [x] Sent '%s'", msg);

    //Close Connection
    setTimeout(() => {
      Connection.close();
      process.exit(0);
    }, 500)
  } catch (error) {
    console.error(error.message);
  }
}

sendMessage();