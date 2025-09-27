import amqp from "amqplib"

const queue = 'task_queue';


const reciveMessage = async () => {
  try {
    //Connection
    const Connection = await amqp.connect("amqp://localhost");
    const channel = await Connection.createChannel();

    //Ensure Queue Exist
    await channel.assertQueue(queue, { durable: true });

    //Prefetch one message at a time per worker 
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    //Consume message
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log("Reciver : %s", content);

        //Simulate work (1dot = 1s delay)
        const sec = content.split(".").length - 1;
        await new Promise((resolve) => setTimeout(resolve, sec * 1000));

        console.log(" [✓] Done");
        channel.ack(msg); // acknowledge message
      }
    })
  } catch (error) {
    console.error(error.message);
  }
}

reciveMessage();