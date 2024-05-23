"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) {
      throw new Error("Can't connect to RabbitMQ");
    }
    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {}
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();
    // Publish message to a queue
    const queueName = "test-topic";
    const message = "Hello shopDev by cuongpham";
    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(message));

    // close connection
    await connection.close();
  } catch (error) {
    console.error(error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, {
      durable: true,
    });
    console.log("Waiting for messages...");
    await channel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received message: ${queueName}:  ${msg.content.toString()}`
        );
        // 1. find User following that SHOP
        // 2. send message to user
        // 3. yes, ok ====> success
        // 4. error. setup DLX...
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("error publish message to rabbitMQ", error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
};
