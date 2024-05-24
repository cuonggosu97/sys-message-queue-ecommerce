"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error in consumerToQueue", error);
    }
  },

  // case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess"; // assertQueue
      // 1. TTL
      // const timeExpire = 15000;
      // setTimeout(async () => {
      //   await channel.consume(notiQueue, (msg) => {
      //     console.log(
      //       `SEND notificationQueue successfully processed:  ${msg.content.toString()}`
      //     );
      //     channel.ack(msg);
      //   });
      // }, timeExpire);

      // 2. LOGIC
      await channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });
          if (numberTest < 0.5) {
            throw new Error("Send notification failed: HOT FIX");
          }
          console.log(
            `SEND notificationQueue successfully processed:  ${msg.content.toString()}`
          );
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error("Error in consumerToQueueNormal", error);
    }
  },

  // case failed processing
  consumerToQueueFail: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notificationExDLX"; // notificationExDLX direct
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // assert
      const notiQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `this notification error: pls hot fix:: ${msgFailed.content.toString()}`
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error("Error in consumerToQueueFail", error);
      throw error;
    }
  },
};

module.exports = messageService;
