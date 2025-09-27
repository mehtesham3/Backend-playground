import amqp from "amqplib"

const queue = 'new_user'

const userService = async () => {
  try {
    //Create channel
    const Connection = await amqp.connect("amqp://localhost");
    const channel = await Connection.createChannel();

    //Create queue
    await channel.assertQueue(queue, { durable: true });

    //Simulate new user signup
    const newUser = { id: 1, name: "Alice", email: "alice@example.com" };

    //Publish message
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(newUser)), { persistent: true });

    console.log("[userService:] New user event published : ", newUser);

    setTimeout(() => {
      Connection.close();
      process.exit(0);
    }, 500)

  } catch (error) {
    console.error(error.message);
  }
}

userService();