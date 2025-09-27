import amqp from 'amqplib'

const queue = 'new_user';

const emailService = async () => {
  try {
    const Connection = await amqp.connect("amqp://localhost");
    const channel = await Connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    console.log("[Email Service] waiting for new users...");

    await channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const user = JSON.parse(msg.content.toString());
        console.log(` [Email Service] Sending welcome email to ${user.email}...`);

        // Simulate email sending delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(` [Email Service] Email sent to ${user.email}`);

        channel.ack(msg);
      }
    })
  } catch (error) {
    console.error(error.message);
  }
};

emailService();
